<script lang="ts">
	import { MINECOUNT_TO_COLOR } from '$lib/constants';
	import { type TileProps } from '$lib/types';
	import clsx from 'clsx';
	import { twMerge } from 'tailwind-merge';
	import { Sound } from '$lib/audio';

	let {
		isMine = $bindable(false),
		isRevealed = $bindable(false),
		mineCount = $bindable(0),
		isFlagged = $bindable(false),
		onclick,
		oncontextmenu,
		class: className = ''
	}: TileProps = $props();

	const handleContextMenu = (event: MouseEvent) => {
		event.preventDefault();
		oncontextmenu?.();
	};

	const handleClick = () => {
		let random = Math.round(Math.random() * 4);
		if (isMine) {
			digSounds.tnt.play();
		} else {
			digSounds[`dig${random}`]?.play();
		}
		onclick?.();
	}

	let displayContent = $derived<() => { bg: string; content: string }>(() => {
		if (isRevealed) {
			if (isMine) {
				return { bg: 'bg-[url("/icons/tnt.png")]', content: '' };
			} else {
				return {
					bg: 'bg-[url("/icons/dirt.png")]',
					content: mineCount > 0 ? mineCount.toString() : ''
				};
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
	const digSounds : {[key: string]: Sound} = {
		dig1: new Sound('/audio/dig1.ogg', { volume: 0.5 }),
		dig2: new Sound('/audio/dig2.ogg', { volume: 0.5 }),
		dig3: new Sound('/audio/dig3.ogg', { volume: 0.5 }),
		dig4: new Sound('/audio/dig4.ogg', { volume: 0.5 }),
		tnt: new Sound('/audio/tnt.ogg', { volume: 0.5 }),
	}
</script>

<button
	type="button"
	aria-label="Tile"
	oncontextmenu={handleContextMenu}
	class={twMerge(
		'h-[32px] w-[32px] shrink-0 bg-cover',
		clsx((mineCount || !isRevealed) && 'cursor-pointer hover:brightness-150'),
		mineCountColor,
		displayContent().bg,
		className
	)}
	style="image-rendering: pixelated;"
	onclick={handleClick}
>
	{displayContent().content}
</button>
