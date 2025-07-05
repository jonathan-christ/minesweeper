<script lang="ts">
	import Game from '$lib/components/Game.svelte';
	import CloudBackground from '$lib/components/CloudBackground.svelte';
	import Credits from '$lib/components/Credits.svelte';
</script>

<CloudBackground />
<div class="relative flex h-[1024px] w-[1024px] flex-col items-center justify-center md:h-screen md:w-screen">
	<Game />
	<div class="absolute bottom-0">
		<Credits />
	</div>
</div>
