<script lang="ts">
	import Tile from "./Tile.svelte";
    import { type GameState } from "$lib/types";

    let gameState = $state<GameState>("playing");

    const matrix = {
		data: [
			[1, 2, 3],
			[4, 5, 6],
			[7, 8, 9]
		]
	};
</script>

<div class="grid grid-cols-3 gap-0 border-red-600 w-fit divide-x-2 divide-y-2 divide-red-600">
    {#each matrix.data as row (row)}
        {#each row as cell (cell)}
            <Tile isMine={false} mineCount={cell} bind:gameState/>
        {/each}
    {/each}
</div>
