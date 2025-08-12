import { WidgetCard } from '../ui/widget-card';

const WIDGET_LIST = ['info', 'tag', 'category'];

export function FsoInfoWidget() {
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
