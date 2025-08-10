import { WidgetCard } from '~/component/layouts/layouts';

const WIDGET_LIST = ['info', 'tag', 'category'];

export function FsoInfo() {
	return (
		<div className="flex flex-col justify-center gap-[10px] align-top">
			{WIDGET_LIST.map(widget => (
				<WidgetCard key={widget} size="middle">
					<section>
						<h1> test</h1>
						<span>test입니다.</span>
						<span>test입니다.</span>
						<span>test입니다.</span>
						<span>test입니다.</span>
					</section>
				</WidgetCard>
			))}
		</div>
	);
}
