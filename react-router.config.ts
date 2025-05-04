import type { Config } from '@react-router/dev/config';

export default {
	// Config options...
	// Server-side render by default, to enable SPA mode set this to `false`
	ssr: false,
	// ssr과 prerender 모두 true인 경우, prerender이 우선됨
	prerender: false,
} satisfies Config;
