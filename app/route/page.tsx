import { memo, useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { typedInvoke } from '~/util/typed-invoke';
import type { Route } from '../+types/root';

export const meta = ({}: Route.MetaArgs) => {
	return [{ title: 'Root Page' }, { name: 'description', content: 'Welcome to React Router!' }];
};

const Page = memo(() => {
	const [loading, setLoading] = useState(true);
	const [dialogOpened, setDialogOpened] = useState(false);  // 호출 여부 flag
	const navigate = useNavigate();

	useEffect(() => {
		if (dialogOpened) return; // 이미 열렸으면 무시

		const checkAndOpenDialog = async () => {
			setLoading(true);
			const folderRes = await typedInvoke('list_folders');

			if (folderRes.status === 'Success' && (folderRes.data?.length ?? 0) === 0) {
				setDialogOpened(true); // 다이얼로그 실행 플래그 설정
				const dialogRes = await typedInvoke('dialog_open');

				if (dialogRes.status === 'Success') {
					const folderPath = dialogRes.data?.[0]?.path;
					if (folderPath) {
						await typedInvoke('add_folder_record', { path: folderPath });
						navigate(`/finder?path=${encodeURIComponent(folderPath)}`);
					} else {
						console.warn('❌ 선택된 폴더가 없습니다');
					}
				} else {
					console.error('❌ 다이얼로그 실패:', dialogRes.message);
				}
			} else {
				const existingPath = folderRes.data?.[0]?.path;
				if (existingPath) {
					navigate(`/finder?path=${encodeURIComponent(existingPath)}`);
				}
			}

			setLoading(false);
		};

		checkAndOpenDialog();
	}, [dialogOpened, navigate]);


	const handleManualDialog = useCallback(async () => {
		const res = await typedInvoke('dialog_open');

		if (res.status === 'Success' && res.data?.[0]?.path) {
			const selectedPath = res.data[0].path;
			await typedInvoke('add_folder_record', { path: selectedPath });
			navigate(`/finder?path=${encodeURIComponent(selectedPath)}`);
		}
	}, []);

	if (loading) return <div className="p-10">🔄 로딩 중...</div>;

	return (
		<main className="mx-auto w-fit py-20">
			<div>main page</div>
			<Link to="/test" className="bg-cyan-700">
				to test
			</Link>
			<Link to="/finder" className="bg-cyan-700">
				to test
			</Link>
		</main>
	);
});

export default () => <Page />;
