<script lang="ts">
	import { type TileProps } from '$lib/types';
	import { twMerge } from 'tailwind-merge';

	let {
		isMine = $bindable(false),
		isRevealed = $bindable(false),
		mineCount = $bindable(0),
		isFlagged = $bindable(false),
		onclick,
		oncontextmenu,
		class: className = ''
	}: TileProps = $props();

	const handleClick = () => onclick?.();
	const handleContextMenu = (event: MouseEvent) => {
		event.preventDefault();
		oncontextmenu?.();
	};

	let displayContent = $derived<() => { bg: string; content: string }>(() => {
		if (isRevealed) {
			if (isMine) {
				return { bg: 'bg-red-600', content: '💣' };
			} else {
				return { bg: 'bg-black', content: mineCount > 0 ? mineCount.toString() : '' };
			}
		} else if (isFlagged) {
			return { bg: 'bg-green-600', content: '🚩' };
		}
		return { bg: 'bg-gray-400', content: '' };
	});
</script>

<button
	type="button"
	aria-label="Tile"
	{onclick}
	oncontextmenu={handleContextMenu}
	class={twMerge('h-[32px] w-[32px] bg-cover text-white', displayContent().bg, className)}
	style="image-rendering: pixelated;"
	{onclick}
>
	{displayContent().content}
</button>
