import { memo, useState } from 'react';
import { useNavigate } from 'react-router';
//
// export const meta = ({}: Route.MetaArgs) => {
// 	return [{ title: 'Root Page' }, { name: 'description', content: 'Welcome to React Router!' }];
// };

const Page = memo(() => {
	const [dialogOpened, setDialogOpened] = useState(false); // 호출 여부 flag
	const navigate = useNavigate();

	// useEffect(() => {
	// 	if (dialogOpened) return; // 이미 열렸으면 무시

	// 	const checkAndOpenDialog = async () => {
	// 		setLoading(true);
	// 		const folderRes = await typedInvoke('list_folders');

	// 		if (folderRes.status === 'Success' && (folderRes.data?.length ?? 0) === 0) {
	// 			setDialogOpened(true); // 다이얼로그 실행 플래그 설정
	// 			const dialogRes = await typedInvoke('dialog_open');

	// 			if (dialogRes.status === 'Success') {
	// 				const folderPath = dialogRes.data?.[0]?.path;
	// 				if (folderPath) {
	// 					await typedInvoke('add_folder_record', { path: folderPath });
	// 					navigate(`/finder?path=${encodeURIComponent(folderPath)}`);
	// 				} else {
	// 					console.warn('❌ 선택된 폴더가 없습니다');
	// 				}
	// 			} else {
	// 				console.error('❌ 다이얼로그 실패:', dialogRes.message);
	// 			}
	// 		} else {
	// 			const existingPath = folderRes.data?.[0]?.path;
	// 			if (existingPath) {
	// 				navigate(`/finder?path=${encodeURIComponent(existingPath)}`);
	// 			}
	// 		}

	// 		setLoading(false);
	// 	};

	// 	checkAndOpenDialog();
	// }, [dialogOpened, navigate]);

	return (
		<main className="flex h-full w-full">
			<aside className="flex w-64 flex-col gap-4 border-r border-gray-200 bg-white px-4 py-10">
				{/* 즐겨찾기 */}
				<div className="bgpy-2 w-full rounded-lg border border-gray-200 bg-slate-200 p-6 font-medium text-white transition">
					즐겨찾기 영역
				</div>

				{/* 태그 */}
				<div>
					<p className="mb-1 block text-sm font-semibold text-gray-700">태그</p>
					<div className="ml-3 max-h-[160px] overflow-auto rounded-lg border border-gray-200 p-3">
						<ul>
							<li>태그1</li>
							<li>태그2</li>
							<li>태그3</li>
							<li>태그1</li>
							<li>태그2</li>
							<li>태그3</li>
							<li>태그1</li>
							<li>태그2</li>
							<li>태그3</li>
						</ul>
					</div>
				</div>

				{/* 카테고리 */}
				<div>
					<p className="mb-1 block text-sm font-semibold text-gray-700">카테고리</p>
					<div className="ml-3 max-h-[160px] overflow-auto rounded-lg border border-gray-200 p-3">
						<ul>
							<li>날짜</li>
							<li>파일유형</li>
						</ul>
					</div>
				</div>
			</aside>

			<div className="flex-1 border-gray-200 bg-amber-100">
				{/* 헤더 */}
				<header className="flex items-center justify-between border-b border-gray-300 px-2 py-1">
					{/* 우측 */}
					<div className="flex items-center gap-2">
						<input placeholder="검색" className="rounded-lg border border-gray-200 bg-white p-2" />
					</div>
					{/* /우측 */}

					{/* 좌측 */}
					<div className="flex items-center gap-2">기타</div>
					{/* /좌측 */}
				</header>
				{/* /헤더 */}

				<div className="p-2">
					<div>
						<p className="mb-1 block text-sm font-semibold text-gray-700">파일</p>
						<div className="ml-3 max-h-[160px] overflow-auto rounded-lg border border-gray-200 p-3">
							<ul>
								<li>파일1</li>
								<li>파일2</li>
								<li>파일3</li>
								<li>파일1</li>
								<li>파일2</li>
								<li>파일3</li>
								<li>파일1</li>
								<li>파일2</li>
								<li>파일3</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
});

export default () => <Page />;
