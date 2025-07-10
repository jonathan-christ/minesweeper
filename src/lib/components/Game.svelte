<script lang="ts">
	import Tile from './Tile.svelte';
	import Timer from './Timer.svelte';
	import { GameController } from '$lib/game';
	import Button from './Button.svelte';
	import type { Difficulty } from '$lib/types';
	import SelectButton from './SelectButton.svelte';
	import { fade } from 'svelte/transition';
	import MobileHeader from './MobileHeader.svelte';
	import { DIFFICULTY_SETUP, MOBILE_DIFFICULTY_SETUP } from '$lib/constants';
	import clsx from 'clsx';
	import { twMerge } from 'tailwind-merge';
	import { onMount } from 'svelte';

	let { difficulty = $bindable('easy') } : { difficulty: Difficulty } = $props();

	let isMobile = $state(typeof window !== 'undefined' ? window.innerWidth < 1024 : false);
	let initialRender = $state(true);
	
	const game = $derived(new GameController('easy', isMobile ? MOBILE_DIFFICULTY_SETUP : DIFFICULTY_SETUP));

	let width = $derived(game.getWidth());
	let tiles = $derived(game.getTiles());
	let flags = $derived(game.getFlags());
	let time = $derived(game.getTimer());
	let currentDifficulty = $derived<Difficulty>(game.getDifficulty());
	let gameState = $derived(game.getState());

	// Preload all tile images for smooth gameplay
	const preloadImages = () => {
		const images = [
			'/icons/grass.png',    // Default tile background
			'/icons/dirt.png',     // Revealed tile background
			'/icons/tnt.png',      // Mine tile
			'/icons/torch.png',    // Flagged tile
			'/icons/barrier.png',  // Additional icon that might be used
		];

		images.forEach(src => {
			const img = new Image();
			img.src = src;
		});
	};

	$effect(() => {
		const unsubscribe = game.tiles.subscribe((newTiles) => {
			tiles = newTiles;
			flags = game.getFlags();
			gameState = game.getState();
		});
		return unsubscribe;
	});

	const checkMobile = () => {
		const wasMobile = isMobile;
		isMobile = window.innerWidth < 1024;

		// Only reset if this isn't the initial render and mobile state has changed
		if (!initialRender && wasMobile !== isMobile) {
			game.setDifficultySetup(isMobile ? MOBILE_DIFFICULTY_SETUP : DIFFICULTY_SETUP);
			game.resetGame();
			width = game.getWidth();
			tiles = game.getTiles();
			flags = game.getFlags();
			time = game.getTimer();
		}
		initialRender = false;
	};

	$effect(() => {
		if (typeof window !== 'undefined') {
			checkMobile();
			window.addEventListener('resize', checkMobile);
			return () => window.removeEventListener('resize', checkMobile);
		}
	});

	onMount(() => {
		preloadImages(); // Preload images when component mounts
		game.resetGame();
	});

	const changeDifficulty = (new_difficulty: Difficulty) => {
		game.setDifficulty(new_difficulty);
		currentDifficulty = new_difficulty;
		difficulty = new_difficulty;
		width = game.getWidth();
		tiles = game.getTiles();
	};

	const classes = {
		outer:
			'shrink-0 bg-minecraft-button border-minecraft-border flex flex-col items-center justify-center border-4',
		inner:
			'shrink-0 bg-minecraft-button-inner border-minecraft-border-inner border-b-minecraft-border-bottom grid w-fit gap-0 border-4'
	};

	const difficultyOptions = [
		{ value: 'easy', label: 'Easy' },
		{ value: 'medium', label: 'Medium' },
		{ value: 'hard', label: 'Hard' }
	];
</script>

{#snippet resetButton()}
	<Button
		className="w-full p-1 pr-2"
		borderClassName="w-fit"
		onclick={() => game.resetGame()}
		label="Reset"
	>
		<img
			src="/icons/reset.png"
			alt=""
			class="h-[2rem] w-[2rem] object-cover"
			style="image-rendering: pixelated;"
			draggable="false"
		/>
	</Button>
{/snippet}

{#snippet difficultySelector()}
	<SelectButton
		options={difficultyOptions}
		value={currentDifficulty}
		className="w-full p-1"
		borderClassName="w-fit"
		onchange={changeDifficulty}
	>
		{#snippet icon()}
			<img
				src="/icons/difficulty.png"
				alt=""
				class="h-[2rem] w-[2rem] object-cover"
				style="image-rendering: pixelated;"
				draggable="false"
			/>
		{/snippet}
	</SelectButton>
{/snippet}

{#snippet timeCounter()}
	<Button
		className="w-full p-1"
		marginClass="pb-[0.25rem]"
		borderClassName="w-fit"
		isActive
		toggleLock
	>
		<img
			src="/icons/time.png"
			alt=""
			class="h-[2rem] w-[2rem] shrink-0 object-cover"
			style="image-rendering: pixelated;"
			draggable="false"
		/>
		<Timer seconds={time} />
	</Button>
{/snippet}

{#snippet flagCount()}
	<Button
		className="w-full p-1"
		marginClass="pb-[0.25rem]"
		borderClassName="w-fit"
		isActive
		toggleLock
	>
		<img
			src="/icons/flags_left.png"
			alt=""
			class="h-[2rem] w-[2rem] shrink-0 object-cover"
			style="image-rendering: pixelated;"
			draggable="false"
		/>
		<span class="w-[2rem] text-center">
			{flags}
		</span>
	</Button>
{/snippet}

{#snippet gameOver(title: string)}
	<div
		in:fade={{ duration: 500 }}
		class="absolute inset-0 z-10 flex items-center justify-center bg-black/75"
	>
		<div class="text-2xl font-bold text-white">{title}</div>
	</div>
{/snippet}

<svelte:head>
	<style>
		/* Prevent content shift during scroll */
		html {
			height: 100%;
			overflow-y: auto;
		}
		body {
			min-height: 100%;
			overscroll-behavior-y: none;
		}
		/* Force hardware acceleration */
		.game-container {
			transform: translateZ(0);
			backface-visibility: hidden;
			perspective: 1000;
			will-change: transform;
		}
	</style>
</svelte:head>

<div class="flex h-full w-full flex-col items-center lg:w-fit lg:justify-center">
	{#if isMobile}
		<MobileHeader
			{flags}
			{time}
			{currentDifficulty}
			onReset={() => game.resetGame()}
			onDifficultyChange={changeDifficulty}
		/>
	{:else}
		<div id="controls" class="mb-2 flex w-full items-center justify-between gap-2 text-white">
			<div class="flex w-fit items-center justify-between gap-2">
				{@render resetButton()}
				{@render difficultySelector()}
			</div>
			<div class="flex w-fit items-center justify-between gap-2">
				{@render timeCounter()}
				{@render flagCount()}
			</div>
		</div>
	{/if}

	<div
		class={twMerge(
			'justify-start',
			clsx(classes.outer, 
				isMobile ? (
					currentDifficulty === 'easy' ? 'h-full items-center justify-center shrink' : 'h-full pb-10'
				) : 'h-fit',
				'game-container py-4 lg:py-0 w-full lg:mt-0 lg:w-auto'
			),
			isMobile ? 'border-y-0' : ''
		)}
	>
		<div
			class={twMerge(clsx(classes.inner, 'relative h-fit lg:w-full'))}
			style="grid-template-columns: repeat({width}, minmax(0, 1fr));"
		>
			{#if gameState === 'lose' || gameState === 'win'}
				{@render gameOver(gameState === 'lose' ? 'Game Over' : 'You Win')}
			{/if}
			{#each tiles as row, y (`row-${y}`)}
				{#each row as cell, x (`cell-${y}-${x}`)}
					<Tile
						{...cell}
						{isMobile}
						difficulty={currentDifficulty}
						class={y === 0 ? 'shadow-[inset_4px_8px_8px_-8px_rgba(0,0,0,1)]' : ''}
						onclick={() => game.revealTile(x, y)}
						oncontextmenu={() => game.flagTile(x, y)}
					/>
				{/each}
			{/each}
		</div>
	</div>
</div>
