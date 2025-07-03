<script lang="ts">
	import { type TileProps } from '$lib/types';
	import clsx from 'clsx';

	let { isMine = false, isRevealed = false, mineCount = 0, onclick }: TileProps = $props();
</script>

<button
	type="button"
	aria-label="Tile"
	{onclick}
	class="h-[32px] w-[32px] bg-blue-600 text-white"
>
	{#if isRevealed}
		{mineCount > 0 ? mineCount : ''}
	{/if}
</button>
