import type { WIDGET_SIZE } from '~/hook/useAppleRadius';
import type { ReactNode } from 'react';

interface widgetProps {
	size: WIDGET_SIZE;
	k?: number;
	children: ReactNode;
}

export function WidgetCard(props: widgetProps) {
	const { size, k = 0.223, children } = props;

	const radiusMap: Record<WIDGET_SIZE, number> = {
		small: 12,
		middle: 16,
		large: 24,
	};

	return (
		<div
			style={{ borderRadius: radiusMap[size] }}
			className="flex items-center justify-center gap-2 border border-black/5 bg-white/90 p-4 shadow-lg backdrop-blur"
		>
			{children}
		</div>
	);
}
