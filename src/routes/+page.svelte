<script lang="ts">
	import { MetaTags } from 'svelte-meta-tags';
	import Game from '$lib/components/Game.svelte';
	import CloudBackground from '$lib/components/CloudBackground.svelte';
	import Credits from '$lib/components/Credits.svelte';
</script>

<MetaTags
	title="Mine-sweeper"
	titleTemplate="%s | Play Online"
	description="Play Minecraft-themed Minesweeper online! A classic puzzle game reimagined with Minecraft's iconic style, sounds, and visuals."
	canonical="https://minesweeper-jonathanchrists-projects.vercel.app/"
	openGraph={{
		type: 'website',
		url: 'https://minesweeper-jonathanchrists-projects.vercel.app/',
		title: 'Mine-sweeper | Play Online',
		description:
			"Play Minecraft-themed Minesweeper online! A classic puzzle game reimagined with Minecraft's iconic style, sounds, and visuals.",
		images: [
			{
				url: 'https://minesweeper-jonathanchrists-projects.vercel.app/og_image.png',
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
		image: 'https://minesweeper-jonathanchrists-projects.vercel.app/og_image.png',
		cardType: 'summary_large_image'
	}}
/>

<CloudBackground />
<div
	class="relative h-full lg:h-full min-h-screen w-full flex-col items-center gap-0 lg:flex lg:justify-center"
>
	<Game />
	<div class="w-full p-0 lg:w-[19rem] z-100 lg:absolute lg:bottom-0 relative h-fit">
		<Credits />
	</div>
</div>
