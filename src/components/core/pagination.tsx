import DownSvg from "../svg/down";

type PaginationProps = {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	className?: string;
	maxVisiblePages?: number;
};

export function Pagination({
	currentPage,
	totalPages,
	onPageChange,
	className = "",
	maxVisiblePages = 3,
}: PaginationProps) {
	const getPaginationRange = () => {
		const range: (number | string)[] = [];
		const halfVisible = Math.floor(maxVisiblePages / 2);
		let startPage = Math.max(1, currentPage - halfVisible);
		const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

		// Adjust if we're at the end
		if (endPage - startPage < maxVisiblePages - 1) {
			startPage = Math.max(1, endPage - maxVisiblePages + 1);
		}

		// Add previous pages indicator if needed
		if (startPage > 1) {
			range.push(1);
			if (startPage > 2) {
				range.push("...");
			}
		}

		// Add visible pages
		for (let i = startPage; i <= endPage; i++) {
			range.push(i);
		}

		// Add next pages indicator if needed
		if (endPage < totalPages) {
			if (endPage < totalPages - 1) {
				range.push("...");
			}
			range.push(totalPages);
		}

		return range;
	};

	if (totalPages <= 1) return null;

	return (
		<div className={`flex items-center justify-end gap-1 ${className}`}>
			<button
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage === 1}
				className="h-8 w-8 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
			>
				<DownSvg className="rotate-90" />
			</button>

			<div className="flex items-center gap-1">
				{getPaginationRange().map((page, index) =>
					page === "..." ? (
						<span key={`ellipsis-${index}`} className="px-2 py-1">
							{page}
						</span>
					) : (
						<button
							key={page}
							onClick={() => onPageChange(Number(page))}
							className={`h-8 w-8 flex items-center justify-center cursor-pointer ${page === currentPage
								? "text-text-high rounded-[500px] border-[0.5px] border-[#636363]"
								: "text-text-low-disabled"
								}`}
						>
							{page}
						</button>
					)
				)}
			</div>

			<button
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
				className="h-8 w-8 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
			>
				<DownSvg className="rotate-270" />
			</button>
		</div>
	);
}
