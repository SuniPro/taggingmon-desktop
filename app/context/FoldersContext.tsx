import React, { createContext, type ReactNode, useContext } from 'react';
import {
	useQuery,
	useMutation,
	useQueryClient,
	type UseMutationResult,
} from '@tanstack/react-query';
import { typedInvoke } from '~/util/typed-invoke';
import type { Folder } from 'src-tauri/bindings/Folder';
import type { Response } from 'src-tauri/bindings/Response';

type FolderContextType = {
	folders: Folder[];
	isLoading: boolean;
	error: Error | null;
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

export function FolderProvider({ children }: { children: ReactNode }) {
	const queryClient = useQueryClient();

	const { data, isLoading, error } = useQuery<Folder[], Error>({
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

	return (
		<FolderContext.Provider
			value={{
				folders: data ?? [],
				isLoading,
				error: error ?? null,
				addFolderInRecord,
				deleteFolderInRecord,
				deleteFolder
			}}
		>
			{children}
		</FolderContext.Provider>
	);
}

export function useFolder() {
	const context = useContext(FolderContext);
	if (!context) throw new Error('useFolder must be used within FolderProvider');
	return context;
}
