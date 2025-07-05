<script lang="ts">
	import { Separator } from '$lib/components/ui/separator';
	import Button from '$lib/components/Button.svelte';
	let showCredits = $state(false);
</script>

<Button label="Credits" className="text-xs" onclick={() => (showCredits = !showCredits)} />
{#if showCredits}
	<div class="flex flex-col gap-1 text-left text-xs text-white/75 bg-black p-4">
		<div><b>Dig sounds</b> - "gravel walking.aif" by tigersound</div>
		<div><b>Button click</b> - "btn121.wav" by junggle</div>
		<div><b>TNT explosion</b> - "largex.wav" by inferno</div>
		<div><b>Torch place</b> - "Hitting Wood" by altfuture</div>
	</div>
{/if}
