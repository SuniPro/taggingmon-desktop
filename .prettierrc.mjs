/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
	printWidth: 110,
	tabWidth: 2,
	trailingComma: 'all',
	singleQuote: true,
	bracketSpacing: true,
	semi: true,
	useTabs: true,
	arrowParens: 'avoid',
	endOfLine: 'lf',
	plugins: ['prettier-plugin-tailwindcss'],
	tailwindFunctions: ['clsx', 'cn'],
	tailwindAttributes: ['class', 'className', 'classNames'],
};

export default config;
