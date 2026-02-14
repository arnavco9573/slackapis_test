interface HeaderCardProps {
	label: string;
	value: string | number | React.ReactNode;
}

export default function HeaderCard({
	label,
	value,
}: HeaderCardProps) {
	return (
		<div className="flex bg-neutral-01 min-w-[120px] p-4 flex-col justify-center items-start gap-1 rounded-lg section-border w-full">
			<p className="font-normal text-sm leading-4 text-(--Primary-600)">
				{label}
			</p>
			<div className="text-2xl font-semibold text-text-highest mt-1 w-full">
				{value}
			</div>
		</div>
	);
}

export function HeaderCardSkeleton() {
	return (
		<div className="flex bg-item-in-container min-w-[120px] p-4 flex-col justify-center items-start gap-2 rounded-lg section-border animate-pulse w-full">
			<div className="h-4 w-24 bg-neutral-20 rounded" />
			<div className="h-8 w-16 bg-neutral-25 rounded mt-1" />
		</div>
	);
}
