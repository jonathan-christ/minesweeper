<script lang="ts">
	import { MINECOUNT_TO_COLOR } from '$lib/constants';
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
				return { bg: 'bg-[url("/icons/tnt.png")]', content: '' };
			} else {
				return { bg: 'bg-[url("/icons/dirt.png")]', content: mineCount > 0 ? mineCount.toString() : '' };
			}
		} else if (isFlagged) {
			return { bg: 'bg-[url("/icons/torch.png")] hover:brightness-150', content: '' };
		}
		return {
			bg: 'hover:brightness-150 active:brightness-50 bg-[url("/icons/grass.png")]',
			content: ''
		};
	});

	const mineCountColor = $derived(MINECOUNT_TO_COLOR[mineCount]);
</script>

<button
	type="button"
	aria-label="Tile"
	oncontextmenu={handleContextMenu}
	class={twMerge('h-[32px] w-[32px] bg-cover', mineCountColor, displayContent().bg, className)}
	style="image-rendering: pixelated;"
	{onclick}
>
	{displayContent().content}
</button>
