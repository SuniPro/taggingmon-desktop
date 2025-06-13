import type { FileInfo } from 'src-tauri/bindings/FileInfo';

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
