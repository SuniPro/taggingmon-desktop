import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@heroui/react';
import { useFolderContext } from '~/context/FoldersContext';
import { typedInvoke } from '~/util/typed-invoke';

/** SNB에 추가될 folder List 컴포넌트입니다.
 * folder list를 컨텍스트를 통해 수령받아
 *
 * 사용자가 폴더 내부의 파일을 볼 수 있도록 finder에 쿼리스트링 방식으로 경로를 전달하거나,
 * db에서 폴더를 삭제하는 기능을 수행합니다.
 * */
export function FolderList() {
	const [openDropdownId, setOpenDropdownId] = useState<bigint | null>(null);
	const navigate = useNavigate();

	const {record, addFolderInRecord, deleteFolderInRecord} = useFolderContext();
	const {folders} = record;

	useEffect(() => {
		if (folders.length === 0){
			onAddFolder().then()
		}
	}, [folders]);

	const onAddFolder = async () => {
		const res = await typedInvoke('dialog_open');
		if (res.status === 'Success' && res.data?.[0]?.path) {
			const selectedPath = res.data[0].path;
			addFolderInRecord.mutate(selectedPath);
		} else {
			console.warn('폴더 선택이 취소되었거나 실패했습니다.');
		}
	};

	const handleClick = (path: string) => {
		navigate(`/finder?path=${encodeURIComponent(path)}`);
	};

	const handleDelete = (path: string) => {
		deleteFolderInRecord.mutate(path);
	};

	// 우클릭 시 해당 id의 드롭다운 열기, 기본 우클릭 메뉴 막기
	const handleContextMenu = (e: React.MouseEvent, id: bigint) => {
		e.preventDefault();
		setOpenDropdownId(prev => (prev === id ? null : id));
	};

	return (
		<div className="p-4">
			<h2 className="mb-2 text-lg font-bold">📁 등록된 폴더</h2>
			<ul className="space-y-2">
				{folders.map((folder) => (
					<li key={folder.id}>
						<Dropdown
							isOpen={openDropdownId === folder.id}
							onOpenChange={(isOpen : boolean) => {
								if (isOpen) {
									setOpenDropdownId(folder.id);
								} else if (openDropdownId === folder.id) {
									setOpenDropdownId(null);
								}
							}}
						>
							<DropdownTrigger>
								<Button
									variant="ghost"
									className="text-blue-600 underline hover:text-blue-800"
									onClick={() => handleClick(folder.path)} // 좌클릭 이동
									onContextMenu={e => handleContextMenu(e, folder.id)} // 우클릭 메뉴 열기
								>
									{folder.path}
								</Button>
							</DropdownTrigger>

							<DropdownMenu aria-label="Folder actions">
								<DropdownItem
									key="move"
									onClick={() => {
										handleClick(folder.path);
										setOpenDropdownId(null);
									}}
								>
									Move
								</DropdownItem>
								<DropdownItem
									key="delete"
									onClick={() => {
										handleDelete(folder.path);
										setOpenDropdownId(null);
									}}
									className="text-danger"
									color="danger"
								>
									Delete folder
								</DropdownItem>
							</DropdownMenu>
						</Dropdown>
					</li>
				))}
			</ul>
		</div>
	);
}
