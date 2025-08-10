import { Input as _Input, extendVariants, input, type InputProps } from '@heroui/react';
import { type FC } from 'react';

export const Input = extendVariants(_Input, {
	variants: {
		...input.variants,
	},
	defaultVariants: {
		...input.defaultVariants,
		variant: 'bordered',
		autoComplete: 'off',
	},
	compoundVariants: [
		{
			color: 'default',
			variant: 'bordered',
			// @ts-ignore
			className: {
				base: '[&_[data-slot=description]]:text-sm',
				label: 'text-lg font-medium pb-2.5 leading-[17px]',
				inputWrapper:
					'group-data-[focus=true]:border-black/30 border-1 transition-all hover:bg-gray-50 focus-within:bg-gray-50 rounded-xl group-[&:has(input[readonly])]:bg-stone-100',
				input: 'text-sm file:hidden [&:not([data-filled])]:text-gray-400 placeholder:text-gray-400',
			} satisfies InputProps['classNames'],
		},
	],
}) as FC<InputProps>;
