<script lang="ts">
	import Tile from './Tile.svelte';
	import Timer from './Timer.svelte';
	import { GameController } from '$lib/game';
	import Button from './Button.svelte';
	import type { Difficulty } from '$lib/types';
	import { onMount, type Snippet } from 'svelte';
	import SelectButton from './SelectButton.svelte';
	import { fade } from 'svelte/transition';

	const game = new GameController('easy');

	let width = $state(game.getWidth());
	let tiles = $state(game.getTiles());
	let flags = $state(game.getFlags());
	let time = $state(game.getTimer());
	let currentDifficulty = $state<Difficulty>(game.getDifficulty());
	let gameState = $state(game.getState());

	$effect(() => {
		const unsubscribe = game.tiles.subscribe((newTiles) => {
			tiles = newTiles;
			flags = game.getFlags();
			gameState = game.getState();
		});
		return unsubscribe;
	});

	const changeDifficulty = (difficulty: Difficulty) => {
		game.setDifficulty(difficulty);
		currentDifficulty = difficulty;
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
		class="absolute inset-0 z-50 flex items-center justify-center bg-black/75"
	>
		<div class="text-2xl font-bold text-white">{title}</div>
	</div>
{/snippet}

<div class="flex w-fit flex-col items-center justify-center">
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

	<div class={classes.outer + ' w-auto overflow-auto'}>
		<div
			class={classes.inner + ' w-auto relative'}
			style="grid-template-columns: repeat({width}, minmax(0, 1fr));"
		>
			{#if gameState === 'lose' || gameState === 'win'}
				{@render gameOver(gameState === 'lose' ? 'Game Over' : 'You Win')}
			{/if}
			{#each tiles as row, y (`row-${y}`)}
				{#each row as cell, x (`cell-${y}-${x}`)}
					<Tile
						{...cell}
						class={y === 0 ? 'shadow-[inset_4px_8px_8px_-8px_rgba(0,0,0,1)]' : ''}
						onclick={() => game.revealTile(x, y)}
						oncontextmenu={() => game.flagTile(x, y)}
					/>
				{/each}
			{/each}
		</div>
	</div>
</div>
