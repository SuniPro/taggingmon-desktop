import { Button } from '@heroui/button';
import { invoke } from '@tauri-apps/api/core';
import { memo, useCallback } from 'react';
import { Link } from 'react-router';
import type { Route } from '../+types/root';

export const meta = ({}: Route.MetaArgs) => {
	return [{ title: 'Root Page' }, { name: 'description', content: 'Welcome to React Router!' }];
};

const Page = memo(() => {
	const handleOpenDialog = useCallback(async () => {
		try {
			const result = await invoke('dialog_open');
			console.log('Rust 함수 실행 성공:', result);
		} catch (error) {
			console.error('Rust 함수 실행 실패:', error);
		}
	}, [invoke]);

	return (
		<main className="mx-auto w-fit py-20">
			<div>main page</div>
			<Link to="/test" className="bg-cyan-700">
				to test
			</Link>
			<Button onPress={handleOpenDialog}>oepn dialog</Button>
		</main>
	);
});

export default () => <Page />;
