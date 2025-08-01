import { useLocation } from 'react-router';
import { useCallback, useEffect, useState } from 'react';
import type { FileInfo } from '../../../src-tauri/bindings/FileInfo';
import { typedInvoke } from '~/util/typed-invoke';
import { File } from '~/component/File';

export default function Finder() {
	const location = useLocation();
	const params = new URLSearchParams(location.search);
	const folderPath = params.get('path') ?? '/Users/ariel/dev'; // 쿼리 스트링에서 읽기

	const [files, setFiles] = useState<FileInfo[]>([]);

	const loadFiles = useCallback(async () => {
		const res = await typedInvoke('read_folder', { path: folderPath });
		if (res.status === 'Success') {
			setFiles(res.data ?? []);
		} else {
			console.error('폴더 로딩 실패:', res.message);
		}
	}, [folderPath]);

	useEffect(() => {
		loadFiles();
	}, [loadFiles]);

	return (
		<div className="folder-box rounded border p-4">
			<h2 className="mb-2 text-xl font-semibold">📂 폴더: {folderPath}</h2>

			<button onClick={loadFiles} className="mb-4 rounded bg-blue-600 px-3 py-1 text-white">
				🔄 Load Files
			</button>

			<ul className="grid grid-cols-4 gap-4">
				{files.map(file => (
					<File key={file.path} file={file} />
				))}
			</ul>
		</div>
	);
}
