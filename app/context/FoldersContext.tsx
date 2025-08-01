import React, { createContext, type Dispatch, type ReactNode, type SetStateAction, useContext, useState } from 'react';
import {
	useQuery,
	useMutation,
	useQueryClient,
	type UseMutationResult,
} from '@tanstack/react-query';
import { typedInvoke } from '~/util/typed-invoke';
import type { Folder } from 'src-tauri/bindings/Folder';
import type { Response } from 'src-tauri/bindings/Response';
import type { QueryObserverResult, RefetchOptions } from '@tanstack/query-core';
import type { FileInfo } from '../../src-tauri/bindings/FileInfo';

type FolderContextType = {
	record : {
		folders: Folder[];
		isLoading: boolean;
		error: Error | null;
		refetch:(options?: RefetchOptions) => Promise<QueryObserverResult<Folder[], Error>>;
	}
	addFolderInRecord:  UseMutationResult<Response<void>, Error, string, {
		previousFolders: Folder[] | undefined
	}>;
	deleteFolderInRecord:  UseMutationResult<Response<Response<void>>, Error, string, {
		previousFolders: Folder[] | undefined
	}>;
	deleteFolder:  UseMutationResult<Response<Response<void>>, Error, string, {
		previousFolders: Folder[] | undefined
	}>;
};

const FolderContext = createContext<FolderContextType | null>(null);

/** 폴더와 관련한 모든 기능을 수행할 수 있도록 하는 컨텍스트입니다.
 *
 * DB 내부에 폴더 경로를 저장시키거나, 삭제하는 CRUD 기능이 있으며
 * 실제 폴더 오브젝트를 삭제, 수정하는 기능도 추후 반영 예정입니다.
 * */
export function FolderProvider({ children }: { children: ReactNode }) {

	const [files, setFiles] = useState<FileInfo[]>([])

	const { data, isLoading, error, refetch } = useQuery<Folder[], Error>({
		queryKey: ['folders'],
		queryFn: async () => {
			const res = await typedInvoke('list_folders');
			if (res.status !== 'Success') throw new Error(res.message || 'Failed to fetch folders');
			return res.data ?? [];
		},
	});

	/** 실제 폴더를 읽는 메소드 */
	const readFolder = useMutation({
		mutationFn: (path: string) => typedInvoke('read_folder', { path }),
		onSuccess: (res) => {
			if (res.status === 'Success') {
				setFiles(res.data ?? []);
			} else {
				console.error('폴더 로딩 실패:', res.message);
			}
		},
		onError: (err, folderPath) => {
			console.error('폴더 로딩 실패:', err, folderPath);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ['folders'] });
		},
	});


	/** 실제 폴더를 삭제하는 메소드 */
	const deleteFolder = useMutation({
		mutationFn: (path: string) => typedInvoke('delete_folder', { path }),
		onMutate: async (folderPath: string) => {
			await queryClient.cancelQueries({ queryKey: ['folders'] });
			const previousFolders = queryClient.getQueryData<Folder[]>(['folders']);

			if (previousFolders) {
				queryClient.setQueryData(
					['folders'],
					previousFolders.filter(folder => folder.path !== folderPath)
				);
			}

			return { previousFolders };
		},
		onError: (err: Error, folderPath: string, context) => {
			console.error('폴더 삭제 실패:', err, folderPath);
			if (context?.previousFolders) {
				queryClient.setQueryData(['folders'], context.previousFolders);
			}
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ['folders'] });
		},
	});

	const queryClient = useQueryClient();

	const { data : recordData, isLoading : recordIsLoading, error : recordReadError, refetch : recordRefetch } = useQuery<Folder[], Error>({
		queryKey: ['folders'],
		queryFn: async () => {
			const res = await typedInvoke('list_folders');
			if (res.status !== 'Success') throw new Error(res.message || 'Failed to fetch folders');
			return res.data ?? [];
		},
	});

	/** 폴더를 db에 추가하는 메소드*/
	const addFolderInRecord = useMutation({
		mutationFn: (path: string) => typedInvoke('add_folder_record', { path }),
			onMutate: async (newFolderPath : string) => {
				await queryClient.cancelQueries({ queryKey : ['folders']});
				const previousFolders = queryClient.getQueryData<Folder[]>(['folders']);

				if (previousFolders) {
					queryClient.setQueryData(['folders'], [...previousFolders, { path: newFolderPath, id: -1, created_at: '' }]);
				}

				return { previousFolders };
			},
			onError: (err : Error, newFolderPath : string) => {
				console.error('폴더 삭제 실패:', err, newFolderPath);
			},
			onSettled: () => {
				queryClient.invalidateQueries({queryKey : ['folders']});
			}
		}
	);

	/** 폴더를 db에서 삭제하는 메소드 */
	const deleteFolderInRecord = useMutation({
		mutationFn: (path: string) => typedInvoke('delete_folder_record', { path }),
		onMutate: async (folderPath: string) => {
			await queryClient.cancelQueries({ queryKey: ['folders'] });
			const previousFolders = queryClient.getQueryData<Folder[]>(['folders']);

			if (previousFolders) {
				queryClient.setQueryData(
					['folders'],
					previousFolders.filter(folder => folder.path !== folderPath)
				);
			}

			return { previousFolders };
		},
		onError: (err: Error, folderPath: string, context) => {
			console.error('폴더 삭제 실패:', err, folderPath);
			if (context?.previousFolders) {
				queryClient.setQueryData(['folders'], context.previousFolders);
			}
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ['folders'] });
		},
	});

	return (
		<FolderContext.Provider
			value={{
				record: {
					folders: recordData ?? [],
					isLoading : recordIsLoading,
					error: recordReadError ?? null,
					refetch: recordRefetch
				},
				addFolderInRecord,
				deleteFolderInRecord,
				deleteFolder
			}}
		>
			{children}
		</FolderContext.Provider>
	);
}

export function useFolderContext() {
	const context = useContext(FolderContext);
	if (!context) throw new Error('useFolder must be used within FolderProvider');
	return context;
}
