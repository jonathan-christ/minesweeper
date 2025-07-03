<script lang="ts">
	import Tile from './Tile.svelte';
	import { GameController } from '$lib/game';

	const game = new GameController('hard');
	const width = game.getWidth();

	let tiles = $state(game.getTiles());
	$effect(() => {
		const unsubscribe = game.tiles.subscribe((newTiles) => {
			tiles = newTiles;
		});
		return unsubscribe;
	});
</script>

<div id="controls" class="flex items-center justify-center gap-2">
	<button class="bg-white p-4" onclick={() => game.resetGame()}>Reset</button>
</div>

<div
	class="grid w-fit gap-0 divide-x-2 divide-y-2 divide-red-600 border-2 border-red-600"
	style="grid-template-columns: repeat({width}, minmax(0, 1fr));"
>
	{#each tiles as row, y (`row-${y}`)}
		{#each row as cell, x (`cell-${y}-${x}`)}
			<Tile
				{...cell}
				onclick={() => game.revealTile(x, y)}
				oncontextmenu={() => game.flagTile(x, y)}
			/>
		{/each}
	{/each}
</div>
