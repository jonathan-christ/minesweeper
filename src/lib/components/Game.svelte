<script lang="ts">
	import Tile from './Tile.svelte';
	import { GameController } from '$lib/game';
	import { twMerge } from 'tailwind-merge';
	import type { Difficulty } from '$lib/types';

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
			'shrink-0 bg-minecraft-button border-minecraft-border-inner border-b-minecraft-border-bottom grid w-fit gap-0 border-4'
	};
</script>

<div class="flex w-fit flex-col items-center justify-center">
	<div class={twMerge(classes.outer, 'mb-4 w-full')}>
		<div
			id="controls"
			class={twMerge(classes.inner, 'flex w-full items-center justify-start gap-2')}
		>
			<button class="bg-white p-4" onclick={() => game.resetGame()}>Reset</button>
			<select
				class="bg-white p-4"
				onchange={(e) => changeDifficulty(e.currentTarget.value as Difficulty)}
			>
				{#each ['easy', 'medium', 'hard'] as difficulty}
					<option value={difficulty}>{difficulty}</option>
				{/each}
			</select>
			<div id="flag_count" class="bg-white p-4">
				Flags: {flags}
			</div>
		</div>
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
