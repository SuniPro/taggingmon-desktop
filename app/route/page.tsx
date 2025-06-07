import { Button } from '@heroui/button';
import { memo, useCallback } from 'react';
import { Link } from 'react-router';
import { typedInvoke } from '~/util/typed-invoke';
import type { Route } from '../+types/root';

export const meta = ({}: Route.MetaArgs) => {
	return [{ title: 'Root Page' }, { name: 'description', content: 'Welcome to React Router!' }];
};

const Page = memo(() => {
	const handleOpenDialog = useCallback(async () => {
		try {
			const result = await typedInvoke('dialog_open', {});
			console.log('Rust 함수 실행 성공:', result);

			result.data?.forEach(file => console.log(file.name));
		} catch (error) {
			console.error('Rust 함수 실행 실패:', error);
		}
	}, [typedInvoke]);

	const handleHelloWorld = useCallback(async () => {
		const result = await typedInvoke('hello_world', { str_arg: '123123' });

		console.log(result);
	}, []);

	return (
		<main className="mx-auto w-fit py-20">
			<div>main page</div>
			<Link to="/test" className="bg-cyan-700">
				to test
			</Link>
			<Button onPress={handleOpenDialog}>oepn dialog</Button>
			<Button onPress={handleHelloWorld}>hello World</Button>
		</main>
	);
});

export default () => <Page />;
