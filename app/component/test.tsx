import { FolderList } from '~/component/Folder/FolderList';
import { Button } from '@heroui/button';
import { useFolder } from '~/context/FoldersContext';
import { typedInvoke } from '~/util/typed-invoke';

export const Test = () => {
	const { addFolderInRecord } = useFolder();
	const onAddFolder = async () => {
		const res = await typedInvoke('dialog_open');
		if (res.status === 'Success' && res.data?.[0]?.path) {
			const selectedPath = res.data[0].path;
			addFolderInRecord.mutate(selectedPath);
		} else {
			console.warn('폴더 선택이 취소되었거나 실패했습니다.');
		}
	};

	return   <div className="flex flex-col justify-start items-start gap-4">
		<div>TEST FUNCTION</div>
		<Button onPress={onAddFolder}>폴더추가</Button>
		<FolderList />
	</div>
};
