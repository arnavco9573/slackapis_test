'use client';

import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import Button from "@/components/core/button";
import { formatDate } from "date-fns";
import DotsPattern from "@/components/svg/dots-pattern";

export default function MessageToInvestor({ taskId }: { taskId: string }) {
	const [message, setMessage] = useState("");
	// Mocking messages for now
	const [messages, setMessages] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const [height, setHeight] = useState(167); // Default height matching original h-[167px]
	const isResizing = useRef(false);

	const handleMouseDown = (e: React.MouseEvent) => {
		isResizing.current = true;
		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);
		document.body.style.userSelect = 'none';
	};

	const handleMouseMove = (e: MouseEvent) => {
		if (!isResizing.current) return;
		const newHeight = e.clientY - (textareaRef.current?.getBoundingClientRect().top || 0);
		if (newHeight >= 100 && newHeight <= 400) {
			setHeight(newHeight);
		}
	};

	const handleMouseUp = () => {
		isResizing.current = false;
		document.removeEventListener('mousemove', handleMouseMove);
		document.removeEventListener('mouseup', handleMouseUp);
		document.body.style.userSelect = 'none';
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!message.trim()) return;

		try {
			// Mocking send
			const newMessage = {
				id: Date.now().toString(),
				content: message,
				created_at: new Date().toISOString(),
				sender_type: 'admin'
			};
			setMessages([newMessage, ...messages]);
			setMessage("");
			toast.success("Message sent");
		} catch (err) {
			console.error(err);
			toast.error("Failed to send message");
		}
	};

	return (
		<div className="flex flex-col gap-6 w-full h-[575px] bg-card section-border p-6 rounded-xl">
			<h3 className="text-xl font-medium text-text-highest">Messages</h3>

			<div className="flex flex-col gap-6 flex-1 min-h-0">
				<form
					onSubmit={handleSubmit}
					className="flex w-full flex-col gap-3"
				>
					<div className="relative w-full">
						<textarea
							ref={textareaRef}
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							placeholder="Type your message here..."
							className="w-full bg-neutral-03 border border-neutral-10 rounded-xl p-4 text-sm text-text-high placeholder:text-text-low focus:outline-none focus:border-neutral-20 transition-colors resize-none"
							style={{ height: `${height}px` }}
						/>
						<div
							onMouseDown={handleMouseDown}
							className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize flex items-center justify-center group"
						>
							<div className="w-8 h-1 bg-neutral-10 rounded-full group-hover:bg-neutral-20 transition-colors" />
						</div>
					</div>
					<Button
						type="submit"
						disabled={!message.trim()}
					>
						Send
					</Button>
				</form>

				<div className="flex flex-col gap-4 flex-1 min-h-0">
					<h3 className="text-base font-medium text-text-high">
						Previous Messages
					</h3>

					<div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
						{messages.length === 0 ? (
							<div className="flex flex-col items-center justify-center h-full gap-4 opacity-40">
								<DotsPattern className="size-12" />
								<p className="text-sm">No messages yet</p>
							</div>
						) : (
							<div className="flex flex-col gap-3">
								{messages.map((msg) => (
									<div
										key={msg.id}
										className="p-4 rounded-xl bg-neutral-03 border border-neutral-10 flex flex-col gap-2"
									>
										<div className="flex justify-between items-center">
											<span className="text-xs font-medium text-text-low capitalize">
												{msg.sender_type}
											</span>
											<span className="text-[10px] text-text-low">
												{formatDate(msg.created_at, 'dd MMM, HH:mm')}
											</span>
										</div>
										<p className="text-sm text-text-high leading-relaxed">
											{msg.content}
										</p>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
