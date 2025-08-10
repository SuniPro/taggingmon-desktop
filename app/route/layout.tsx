import { memo, useEffect } from 'react';
import { Outlet } from 'react-router';

const Layout = memo(() => {
	document.documentElement.classList.toggle(
		'dark',
		localStorage.theme === 'dark' ||
			(!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches),
	);

	useEffect(() => {
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

		const handleMatchChange = (event: { matches: boolean | ((prevState: boolean) => boolean) }) => {
			if (event.matches) {
				document.documentElement.classList.toggle('dark', true);
			} else {
				document.documentElement.classList.toggle('dark', false);
			}
		};

		mediaQuery.addListener(handleMatchChange);

		return () => {
			mediaQuery.removeListener(handleMatchChange);
		};
	}, []);

	return (
		<div className="h-full w-full overflow-hidden">
			<div
				className="titlebar absolute inset-0 h-8 w-full bg-transparent select-none"
				data-tauri-drag-region
			/>

			<Outlet />
		</div>
	);
});

export default () => <Layout />;
