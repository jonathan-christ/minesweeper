<script lang="ts">
	import Tile from './Tile.svelte';
	import { GameController } from '$lib/game';
	import { twMerge } from 'tailwind-merge';

	const game = new GameController('hard');
	const width = game.getWidth();

	let tiles = $state(game.getTiles());
	$effect(() => {
		const unsubscribe = game.tiles.subscribe((newTiles) => {
			tiles = newTiles;
		});
		return unsubscribe;
	});

	const classes = {
		outer:
			'shrink-0 bg-minecraft-button border-minecraft-border flex flex-col items-center justify-center border-4',
		inner:
			'shrink-0 bg-minecraft-button border-minecraft-border-inner border-b-minecraft-border-bottom grid w-fit gap-0 border-4'
	};
</script>

<div class="flex flex-col items-center justify-center w-fit">
	<div class={twMerge(classes.outer, 'mb-4 w-full')}>
		<div id="controls" class={twMerge(classes.inner, 'flex items-center justify-start gap-2 w-full')}>
			<button class="bg-white p-4" onclick={() => game.resetGame()}>Reset</button>
		</div>
	</div>

	<div class={classes.outer + ' w-auto overflow-auto'}>
		<div class={classes.inner + ' w-auto'} style="grid-template-columns: repeat({width}, minmax(0, 1fr));">
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
