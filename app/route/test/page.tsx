import { Button } from '@heroui/button';
import { Spinner } from '@heroui/spinner';
import { Link } from 'react-router';
import type { Route } from '../+types/layout';

export const meta = ({}: Route.MetaArgs) => {
	return [{ title: 'Test Page' }];
};

const Page = () => {
	return (
		<main className="mx-auto w-fit py-20">
			<div>test page</div>

			<Link to="/" className="bg-blue-700">
				to home
			</Link>
			<Button as={Link} to="/">
				to Home Link Button
			</Button>
			<Button isLoading> asds</Button>
			<Spinner variant="gradient" />
		</main>
	);
};

export default () => <Page />;
