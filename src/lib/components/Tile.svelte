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
		class: className = '',
		isMobile = false,
		difficulty = 'easy'
	}: TileProps = $props();

	let touchTimeout: number | undefined;
	let touchStartTime = 0;
	const LONG_PRESS_DURATION = 500; // Duration in milliseconds for long press

	// Detect iOS
	const isIOS = $derived(typeof window !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent));

	const handleContextMenu = (event: MouseEvent) => {
		event.preventDefault();
		if (!isFlagged && !isRevealed) {
			digSounds.flag.play();
		}
		oncontextmenu?.();
	};

	const handleTouchStart = (event: TouchEvent) => {
		if (!isIOS) return;
		event.preventDefault();
		touchStartTime = Date.now();
		touchTimeout = window.setTimeout(() => {
			// Long press detected
			handleContextMenu(new MouseEvent('contextmenu'));
		}, LONG_PRESS_DURATION);
	};

	const handleTouchEnd = (event: TouchEvent) => {
		if (!isIOS) return;
		event.preventDefault();
		const touchDuration = Date.now() - touchStartTime;
		
		if (touchTimeout) {
			clearTimeout(touchTimeout);
			touchTimeout = undefined;
		}

		// If it's a short tap, treat as normal click
		if (touchDuration < LONG_PRESS_DURATION) {
			handleClick();
		}
	};

	const handleTouchMove = (event: TouchEvent) => {
		if (!isIOS) return;
		event.preventDefault();
		// Cancel long press if finger moves
		if (touchTimeout) {
			clearTimeout(touchTimeout);
			touchTimeout = undefined;
		}
	};

	const handleClick = () => {
		let random = Math.round(Math.random() * 4);
		if (!isFlagged) {
			if (isMine) {
				digSounds.tnt.play();
			} else if (!isRevealed || (isRevealed && mineCount > 0)) {
				if (random === 0) random = 1;
				digSounds[`dig${random}`]?.play();
			}
		}
		onclick?.();
	};

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

	const tileSize = $derived(isMobile && difficulty === 'hard' ? 'h-[24px] w-[24px]' : 'h-[32px] w-[32px]');

	const mineCountColor = $derived(MINECOUNT_TO_COLOR[mineCount]);
	const digSounds: { [key: string]: Sound } = {
		dig1: new Sound('/audio/dig1.ogg', { volume: 0.5 }),
		dig2: new Sound('/audio/dig2.ogg', { volume: 0.5 }),
		dig3: new Sound('/audio/dig3.ogg', { volume: 0.5 }),
		dig4: new Sound('/audio/dig4.ogg', { volume: 0.5 }),
		tnt: new Sound('/audio/tnt.ogg', { volume: 0.5 }),
		flag: new Sound('/audio/torch.ogg', { volume: 1 })
	};
</script>

<button
	type="button"
	aria-label="Tile"
	oncontextmenu={handleContextMenu}
	ontouchstart={isIOS ? handleTouchStart : undefined}
	ontouchend={isIOS ? handleTouchEnd : undefined}
	ontouchmove={isIOS ? handleTouchMove : undefined}
	class={twMerge(
		tileSize,
		'shrink-0 bg-cover',
		clsx((mineCount || !isRevealed) && 'cursor-pointer hover:brightness-150'),
		mineCountColor,
		displayContent().bg,
		className,
		'select-none'
	)}
	style="image-rendering: pixelated;"
	onclick={handleClick}
>
	{displayContent().content}
</button>
