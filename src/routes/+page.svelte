<script lang="ts">
	import clsx from 'clsx';
	import Game from '$lib/components/Game.svelte';
	import Credits from '$lib/components/Credits.svelte';
	import CloudBackground from '$lib/components/CloudBackground.svelte';
	import { MetaTags } from 'svelte-meta-tags';
	import type { Difficulty } from '$lib/types';
	
	let difficulty: Difficulty = $state('easy');
</script>

<MetaTags
	title="Mine-sweeper"
	titleTemplate="%s | Play Online"
	description="Play Minecraft-themed Minesweeper online! A classic puzzle game reimagined with Minecraft's iconic style, sounds, and visuals."
	canonical="https://minesweeper.by-ced.dev/"
	openGraph={{
		type: 'website',
		url: 'https://minesweeper.by-ced.dev/',
		title: 'Mine-sweeper | Play Online',
		description:
			"Play Minecraft-themed Minesweeper online! A classic puzzle game reimagined with Minecraft's iconic style, sounds, and visuals.",
		images: [
			{
				url: 'https://minesweeper.by-ced.dev/og_image.png',
				width: 1200,
				height: 630,
				alt: 'Minecraft Minesweeper Game Preview'
			}
		],
		siteName: 'Minecraft Minesweeper'
	}}
	twitter={{
		title: 'Minecraft Minesweeper | Play Online',
		description:
			"Play Minecraft-themed Minesweeper online! A classic puzzle game reimagined with Minecraft's iconic style, sounds, and visuals.",
		image: 'https://minesweeper.by-ced.dev/og_image.png',
		cardType: 'summary_large_image'
	}}
/>

<CloudBackground />
<div
	id="main-container"
	class={clsx(
		'relative flex min-h-screen w-full flex-col items-center gap-0 overflow-hidden lg:h-full lg:justify-center',
		difficulty === 'easy' ? 'h-screen' : 'h-full'
	)}
>
	<Game bind:difficulty />
	<div class="relative z-100 h-fit w-full p-0 lg:absolute lg:bottom-0 lg:w-[19rem]">
		<Credits />
	</div>
</div>
