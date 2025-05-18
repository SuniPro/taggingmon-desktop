import { Button } from '@heroui/button';
import { memo, useEffect } from 'react';
import { Outlet } from 'react-router';
import { Test } from '~/component/test';

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
		<div>
			<div className="titlebar absolute inset-0 h-8 w-full bg-white/10 select-none" data-tauri-drag-region />

			<Button className="mx-auto block w-fit">BB</Button>

			<div>layout</div>
			<Outlet />
			<Test />
		</div>
	);
});

export default () => <Layout />;
