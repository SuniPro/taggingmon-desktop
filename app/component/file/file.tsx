import type { FileInfo } from 'src-tauri/bindings/FileInfo';

/** 파일정보를 받아 표시하는 컴포넌트입니다.
 * 현재 화면의 파일 표시 방법에 따라서, 아이콘, 자세히 보기 등이 구현되어야합니다.
 *
 * props : {type : "detail" | "icon" | etc ... } 추가 필요
 * */
export function File(props : {file : FileInfo}) {
	const {file} = props;
	return (
		<li key={file.path} className="flex flex-col items-center text-sm">
			<div className="text-3xl">{getFileIcon(file.extension)}</div>
			<span className="mt-1 max-w-[80px] text-center text-xs break-all">{file.name}</span>
		</li>
	);
}

function getFileIcon(ext?: string | null) {
	const iconMap: Record<string, string> = {
		jpg: '🖼️',
		jpeg: '🖼️',
		png: '🖼️',
		gif: '🖼️',
		txt: '📄',
		md: '📄',
		zip: '🗜️',
		mp4: '🎞️',
		mov: '🎞️',
	};

	if (!ext) return '📁';
	return iconMap[ext.toLowerCase()] ?? '📦';
}
