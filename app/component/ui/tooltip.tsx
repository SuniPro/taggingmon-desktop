import { Tooltip as _Tooltip, type TooltipProps as _TooltipProps } from '@heroui/react';
import {
	Children,
	cloneElement,
	forwardRef,
	isValidElement,
	useCallback,
	useEffect,
	useMemo,
	useState,
	type FC,
} from 'react';

export interface TooltipProps extends _TooltipProps {}

const Tooltip: FC<TooltipProps> = ({ children, isOpen: _isOpen = false, onOpenChange, ...props }) => {
	const [isOpen, setIsOpen] = useState(_isOpen);

	const handleMouseEnter = useCallback(() => {
		setIsOpen(true);
		onOpenChange?.(true);
	}, [onOpenChange]);

	const handleMouseLeave = useCallback(() => {
		setIsOpen(false);
		onOpenChange?.(false);
	}, [onOpenChange]);

	const Trigger = useMemo(() => {
		const count = Children.count(children);

		if (count !== 1) {
			console.warn('Tooltip must have only one child node. Please, check your code.');
			return forwardRef<any, any>((props, ref) => <span {...props} ref={ref} />);
		}

		if (!isValidElement(children)) {
			return forwardRef<any, any>((props, ref) => (
				<p {...props} ref={ref}>
					{children}
				</p>
			));
		}

		const child = children as React.ReactElement & {
			ref?: React.Ref<any>;
		};

		// @ts-expect-error 타입
		const childRef = child.props.ref ?? (child as any).ref;

		return forwardRef<any, any>((props, ref) =>
			cloneElement(child, {
				...props,
				// @ts-expect-error 타입
				...child.props,
				ref: childRef || ref,
			}),
		);
	}, [children]);

	useEffect(() => {
		setIsOpen(_isOpen);
	}, [_isOpen]);

	return (
		<_Tooltip isOpen={isOpen} {...props}>
			<Trigger
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				onClick={() => setIsOpen(!isOpen)}
			/>
		</_Tooltip>
	);
};

export { Tooltip };
