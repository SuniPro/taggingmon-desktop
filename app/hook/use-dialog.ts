import { typedInvoke } from '~/util/typed-invoke';
import { useState } from 'react';
import type { FsoInfo } from '../../src-tauri/bindings/FsoInfo';

export const useDialog = () => {
	const [fsoList, setFsoList] = useState<FsoInfo[]>([]);

	const checkAndOpenDialog = async () => {
		const dialogRes = await typedInvoke('dialog_open');

		if (dialogRes.status === 'Success') {
			if (dialogRes.data) {
				setFsoList(
					dialogRes.data.map(info => ({
						id: null,
						name: info.name,
						path: info.path,
						is_folder: info.size === null && info.extension === null,
						size: info.size,
						created_at: info.created_at,
						modified_at: info.modified_at,
						extension: info.extension,
						readonly: info.readonly,
					})),
				);
			}
		} else {
			console.error('❌ 다이얼로그 실패:', dialogRes.message);
		}
	};

	return { checkAndOpenDialog, fsoList };
};
