import {
	Select as _Select,
	SelectItem as _SelectItem,
	extendVariants,
	listboxItem,
	select,
	type SelectItemProps,
	type SelectProps,
} from '@heroui/react';
import type { FC } from 'react';

export const Select = extendVariants(_Select, {
	variants: {
		...select.variants,
	},
	defaultVariants: {
		...select.defaultVariants,
		variant: 'bordered',
	},
	compoundVariants: [
		{
			color: 'default',
			variant: 'bordered',
			// @ts-ignore
			className: {
				label: 'text-lg font-medium pb-2.5 leading-[17px]',
				trigger: 'hover:bg-gray-50 focus-within:bg-gray-50 border-1 rounded-xl bg-white',
				value: 'text-lg',
			} satisfies SelectProps['classNames'],
		},
	],
}) as FC<SelectProps>;

export const SelectItem = extendVariants(_SelectItem, {
	variants: {
		...listboxItem.variants,
	},
	defaultVariants: {
		...listboxItem.defaultVariants,
	},
	compoundVariants: [
		{
			// @ts-ignore
			className: {
				title: 'text-lg',
			} satisfies SelectItemProps['classNames'],
		},
	],
}) as FC<SelectItemProps>;
