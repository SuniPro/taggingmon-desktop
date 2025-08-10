import type { As } from '@heroui/react';
import type { FC, ReactNode } from 'react';
import type { WIDGET_SIZE } from '~/hook/useAppleRadius';

interface WidgetCardProps {
	size: WIDGET_SIZE;
	children: ReactNode;
	as?: As<any>;
	k?: number;
}

export const WidgetCard: FC<WidgetCardProps> = ({ size, k = 0.223, children, as }) => {
	const Component = as || 'div';

	const radiusMap: Record<WIDGET_SIZE, number> = {
		small: 12,
		middle: 16,
		large: 24,
	};

	return (
		<Component
			style={{ borderRadius: radiusMap[size] }}
			className="flex items-center justify-center gap-2 border border-black/5 bg-white/90 p-4 shadow-lg backdrop-blur"
		>
			{children}
		</Component>
	);
};
