import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@heroui/react';
import { useFolder } from '~/context/FoldersContext';

export function FolderList() {
	const [openDropdownId, setOpenDropdownId] = useState<bigint | null>(null);
	const navigate = useNavigate();

	const {folders, deleteFolderInRecord} = useFolder();

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
				{folders.map((folder, index) => (
					<li key={folder.id}>
						<Dropdown
							isOpen={openDropdownId === folder.id}
							onOpenChange={isOpen => {
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
