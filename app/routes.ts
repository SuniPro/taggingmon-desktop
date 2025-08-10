import { type RouteConfig, index, layout, route } from '@react-router/dev/routes';

export default [
	layout(
		'./route/layout.tsx',

		[index('./route/page.tsx'), route('/finder', './route/finder/page.tsx')],
	),
] satisfies RouteConfig;
