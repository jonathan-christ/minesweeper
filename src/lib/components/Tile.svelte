<script lang="ts">
	import { type TileProps } from '$lib/types';

	let {
		isMine = $bindable(false),
		isRevealed = $bindable(false),
		mineCount = $bindable(0),
		isFlagged = $bindable(false),
		onclick,
		oncontextmenu
	}: TileProps = $props();

	function handleContextMenu(event: MouseEvent) {
		event.preventDefault();
		oncontextmenu?.();
	}
</script>

<button
	type="button"
	aria-label="Tile"
	{onclick}
	oncontextmenu={handleContextMenu}
	class="h-[32px] w-[32px] bg-gray-400 text-white"
>
	{#if isRevealed}
		{#if isMine}
			<div class="h-full w-full bg-red-600">💣</div>
		{:else}
			<div class="h-full w-full bg-black">
				{mineCount > 0 ? mineCount : ''}
			</div>
		{/if}
	{:else if isFlagged}
		<div class="h-full w-full bg-green-600">🚩</div>
	{/if}
</button>
