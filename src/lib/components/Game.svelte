<script lang="ts">
	import Tile from './Tile.svelte';
	import { GameController } from '$lib/game';
	import { twMerge } from 'tailwind-merge';
	import type { Difficulty } from '$lib/types';
	import type { Snippet } from 'svelte';

	const game = new GameController('easy');

	let width = $state(game.getWidth());
	let tiles = $state(game.getTiles());
	let flags = $state(game.getFlags());
	$effect(() => {
		const unsubscribe = game.tiles.subscribe((newTiles) => {
			tiles = newTiles;
			flags = game.getFlags();
		});
		return unsubscribe;
	});

	const changeDifficulty = (difficulty: Difficulty) => {
		game.setDifficulty(difficulty);
		width = game.getWidth();
		tiles = game.getTiles();
	};

	const classes = {
		outer:
			'shrink-0 bg-minecraft-button border-minecraft-border flex flex-col items-center justify-center border-4',
		inner:
			'shrink-0 bg-minecraft-button-inner border-minecraft-border-inner border-b-minecraft-border-bottom grid w-fit gap-0 border-4'
	};
</script>

{#snippet minecraftButton(children: Snippet)}
	<div class={twMerge(classes.outer, 'mb-4 w-fit')}>
		<div class={twMerge(classes.inner, 'w-fit')}>
			{@render children()}
		</div>
	</div>
{/snippet}

{#snippet resetButton()}
	<button
		class="flex w-full shrink-0 flex-row items-center justify-center gap-2 pr-2"
		onclick={() => game.resetGame()}
	>
		<img
			src="/icons/reset.png"
			alt=""
			class="aspect-square h-[2rem] object-cover"
			style="image-rendering: pixelated;"
			draggable="false"
		/>
		Reset
	</button>
{/snippet}

{#snippet difficultySelector()}
	<div class="flex w-full shrink-0 flex-row items-center justify-center gap-2 pr-2">
		<img
			src="/icons/difficulty.png"
			alt=""
			class="aspect-square h-[2rem] object-cover"
			style="image-rendering: pixelated;"
			draggable="false"
		/>
		<select
			class="focus:outline-none"
			onchange={(e) => changeDifficulty(e.currentTarget.value as Difficulty)}
		>
			{#each ['easy', 'medium', 'hard'] as difficulty, index (index)}
				<option class="bg-minecraft-button w-full border-0 p-0" value={difficulty}
					>{difficulty}</option
				>
			{/each}
		</select>
	</div>
{/snippet}

{#snippet flagCount()}
	<div id="flag_count" class="flex w-full shrink-0 flex-row items-center justify-start gap-2 pr-2">
		<img
			src="/icons/flags_left.png"
			alt=""
			class="aspect-square h-[2rem] object-cover"
			style="image-rendering: pixelated;"
			draggable="false"
		/>
		<span class="w-[2rem] text-center">
			{flags}
		</span>
	</div>
{/snippet}

<div class="flex w-fit flex-col items-center justify-center">
	<div id="controls" class="flex w-full items-center justify-between text-white">
		{@render minecraftButton(resetButton)}
		{@render minecraftButton(difficultySelector)}
		{@render minecraftButton(flagCount)}
	</div>

	<div class={classes.outer + ' w-auto overflow-auto'}>
		<div
			class={classes.inner + ' w-auto'}
			style="grid-template-columns: repeat({width}, minmax(0, 1fr));"
		>
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
