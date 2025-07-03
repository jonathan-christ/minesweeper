<script lang="ts">
	import Tile from './Tile.svelte';
	import { GameController } from '$lib/game';
	import type { TileProps } from '$lib/types';

	const game = new GameController('easy');
	const width = game.getWidth();
    
    let tiles: TileProps[][] = [];
	game.tiles.subscribe(v => tiles = v);
</script>

<div
	class="grid w-fit gap-0 divide-red-600 border-red-600 border-2 divide-x-2 divide-y-2"
	style="grid-template-columns: repeat({width}, minmax(0, 1fr));"
>
	{#each tiles as row, y (row)}
		{#each row as cell, x (cell)}
			<Tile
				{...cell}
				onclick={() => game.revealTile(x, y)}
                oncontextmenu={() => game.flagTile(x, y)}
			/>
		{/each}
	{/each}
</div>
