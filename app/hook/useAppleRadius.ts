import { useEffect, useRef, useState } from 'react';

export type WIDGET_SIZE = 'small' | 'middle' | 'large';

export function useAppleRadius(k = 0.223) {
	const ref = useRef<HTMLDivElement>(null);
	const [radius, setRadius] = useState<number>(12); // fallback

	useEffect(() => {
		if (!ref.current) return;
		const el = ref.current;

		const update = () => {
			const rect = el.getBoundingClientRect();
			const r = Math.min(rect.width, rect.height) * k;
			setRadius(r);
		};

		const ro = new ResizeObserver(update);
		ro.observe(el);
		update();

		return () => ro.disconnect();
	}, [k]);

	return { ref, radius };
}
