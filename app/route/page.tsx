import { memo, useEffect } from 'react';
import { FsoInfoWidget } from '~/component/Info/fso-info-widget';
import { Input } from '~/component/ui/input';
import { ScrollArea } from '~/component/ui/scroll-area';
import { X } from 'lucide-react';
import { PlusIcon } from '~/assets/icons/icons';
import { useDialog } from '~/hook/use-dialog';
import { getAllCategories } from '~/hook/use-category-handle';
import { invokeData } from '~/response/response';
//
// export const meta = ({}: Route.MetaArgs) => {
// 	return [{ title: 'Root Page' }, { name: 'description', content: 'Welcome to React Router!' }];
// };

const items = [
	{
		key: 'new',
		label: 'New file',
	},
	{
		key: 'copy',
		label: 'Copy link',
	},
	{
		key: 'edit',
		label: 'Edit file',
	},
	{
		key: 'delete',
		label: 'Delete file',
	},
];
const Page = memo(() => {
	const { checkAndOpenDialog, fsoList } = useDialog();

	useEffect(() => {
		if (fsoList && fsoList.length > 0) {
			console.log('fsoList', fsoList);

			// fsoList를 복사해서 id를 null로 변경하는 로직
			const fsoListWithNullId = fsoList.map(fso => ({
				...fso,
				id: null,
			}));

			// Tauri 커맨드 호출
			// fsoListWithNullId를 camelCase인 fsoList로 전달합니다.
			invokeData<number[]>('process_and_insert_all', { fsoList: fsoListWithNullId })
				.then(ids => {
					// `then` 블록에는 성공 시의 결과인 `ids`만 전달됩니다.
					console.log('성공:', ids);
				})
				.catch(error => {
					// `catch` 블록에는 Rust의 모든 실패 응답(Failed/Canceled)과 Tauri 에러가 `TransferError`로 통일되어 잡힙니다.
					console.error('에러:', error);
				});
		}
	}, [fsoList]);

	const viewCategory = () => {
		getAllCategories().then(r => console.log(r));
	};

	return (
		<main className="flex h-full w-full">
			<aside className="flex w-64 flex-col gap-4 border-r border-gray-200 bg-white px-4 py-10">
				{/* 즐겨찾기 */}
				<div className="w-full space-y-2 rounded-lg border border-gray-200 bg-slate-100 px-4 py-2 text-sm font-medium text-black/80 transition">
					<p>즐겨찾기</p>
					<div className="pl-2">
						<ul className="space-y-1">
							<li>태그 1</li>
							<li>태그 2</li>
							<li>태그 3</li>
							<li>태그 4</li>
						</ul>
					</div>
				</div>

				{/* 태그 */}
				<div>
					<p className="mb-1 block text-sm font-semibold text-gray-700">태그</p>
					<div className="ml-3 h-[160px] rounded-lg border border-gray-200 py-1 pl-3">
						<ScrollArea className="h-full">
							<ul className="space-y-0.5">
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
						</ScrollArea>
					</div>
				</div>

				{/* 카테고리 */}
				<div>
					<p className="mb-1 block text-sm font-semibold text-gray-700">카테고리</p>
					<div className="ml-3 max-h-[160px] overflow-auto rounded-lg border border-gray-200 p-3">
						<ul className="space-y-0.5">
							<li>날짜</li>
							<li>파일유형</li>
						</ul>
					</div>
				</div>
			</aside>

			<div className="flex-1 border-gray-200">
				{/* 헤더 */}
				<header className="flex items-center justify-between border-b border-gray-300 px-2 py-2">
					{/* 우측 */}
					<div className="flex items-center gap-2">
						<Input placeholder="검색" classNames={{ inputWrapper: 'bg-white/80' }} />
					</div>
					{/* /우측 */}

					{/* 좌측 */}
					<div className="flex items-center gap-2">기타</div>
					{/* /좌측 */}
				</header>
				{/* /헤더 */}

				{/* 태그 필터 */}
				<div className="flex items-center gap-2 border-b border-gray-300 p-2">
					<button>
						<X className="h-4 w-4" strokeWidth={3} />
					</button>
					<ul className="flex items-center gap-2 [&_li]:bg-gray-200 [&_li]:px-2 [&_li]:py-1">
						<li>태그 1</li>
						<li>태그 2</li>
						<li>태그 3</li>
						<li>태그 4</li>
					</ul>
				</div>
				{/* /태그 필터 */}

				<button onClick={() => checkAndOpenDialog()} className="h-5 w-5 bg-amber-500"></button>
				<PlusIcon width={40} height={40} />

				<button onClick={viewCategory}>dsfdsf</button>

				{/* 파일 목록 */}
				<div className="flex h-full gap-2">
					{/* 좌측 */}
					<div className="flex-1 p-2">
						<p className="mb-1 block text-sm font-semibold text-gray-700">파일</p>
						<div className="ml-3 h-[160px] rounded-lg border border-gray-200 p-3">
							<ScrollArea className="h-full">
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
							</ScrollArea>
						</div>
					</div>
					<FsoInfoWidget />

					{/* /좌측 */}

					{/* 우측 */}
					<div className="w-[360px] shrink-0 border-l border-gray-200 p-2">
						<div className="flex flex-col border-l border-gray-200 bg-white shadow-sm">
							<div className="border-b border-gray-200 p-4">
								<div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-gray-50">
									<img
										src="/sample-image.png"
										alt="미리보기"
										className="max-h-full max-w-full object-contain"
									/>
								</div>
							</div>

							{/* File Name */}
							<div className="border-b border-gray-200 p-4">
								<h2 className="truncate text-sm font-medium text-gray-800">
									스크린샷 2025-08-10 20.57.59.png
								</h2>
								<p className="text-xs text-gray-500">10KB • PNG 이미지</p>
							</div>

							{/* File Info */}
							<div className="flex-1 overflow-y-auto p-4">
								<dl className="space-y-2 text-sm">
									<div className="flex justify-between">
										<dt className="text-gray-500">위치</dt>
										<dd className="truncate text-gray-800">Macintosh HD › 사용자 › moon › 데스크탑</dd>
									</div>
									<div className="flex justify-between">
										<dt className="text-gray-500">크기</dt>
										<dd className="text-gray-800">10,458 바이트 (12KB)</dd>
									</div>
									<div className="flex justify-between">
										<dt className="text-gray-500">생성일</dt>
										<dd className="text-gray-800">2025년 8월 10일 21:03</dd>
									</div>
									<div className="flex justify-between">
										<dt className="text-gray-500">수정일</dt>
										<dd className="text-gray-800">2025년 8월 10일 21:03</dd>
									</div>
									<div className="flex justify-between">
										<dt className="text-gray-500">형식</dt>
										<dd className="text-gray-800">이미지 (PNG)</dd>
									</div>
									<div className="flex justify-between">
										<dt className="text-gray-500">해상도</dt>
										<dd className="text-gray-800">224 × 492</dd>
									</div>
									<div className="flex justify-between">
										<dt className="text-gray-500">색상 공간</dt>
										<dd className="text-gray-800">RGB</dd>
									</div>
								</dl>
							</div>
						</div>
					</div>
					{/* 우측 */}
				</div>
				{/* /파일 목록 */}
			</div>
		</main>
	);
});

export default () => <Page />;
