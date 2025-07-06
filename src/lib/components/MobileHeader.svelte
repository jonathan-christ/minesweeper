<script lang="ts">
	import type { Difficulty } from '$lib/types';
	import Button from './Button.svelte';
	import Timer from './Timer.svelte';
	import type { Writable } from 'svelte/store';
	import { Sound } from '$lib/audio';

	let {
		flags = $bindable(0),
		time = $bindable<Writable<number>>(),
		currentDifficulty = $bindable<Difficulty>('easy'),
		onReset = () => {},
		onDifficultyChange = (difficulty: Difficulty) => {}
	} = $props();

	const buttonClick = new Sound('/audio/button_click.mp3', { volume: 0.5 });
	const difficultyOptions = [
		{ value: 'easy', label: 'Easy' },
		{ value: 'medium', label: 'Medium' },
		{ value: 'hard', label: 'Hard' }
	];

	const handleReset = () => {
		buttonClick.play();
		onReset();
	};

	const handleDifficultyChange = (e: Event) => {
		buttonClick.play();
		onDifficultyChange((e.currentTarget as HTMLSelectElement).value as Difficulty);
	};
</script>

<Button toggleLock isActive borderClassName="mt-0" className="h-[7vh]">
	<button class="flex h-8 w-8 items-center justify-center active:brightness-50" onclick={handleReset}>
		<img
			src="/icons/reset.png"
			alt="Reset"
			class="h-6 w-6 object-cover"
			style="image-rendering: pixelated;"
			draggable="false"
		/>
	</button>

	<div class="flex items-center gap-1">
		<img
			src="/icons/difficulty.png"
			alt="Difficulty"
			class="h-6 w-6 object-cover"
			style="image-rendering: pixelated;"
			draggable="false"
		/>
		<select
			class="h-8 bg-transparent text-center focus:outline-none"
			value={currentDifficulty}
			onchange={handleDifficultyChange}
		>
			{#each difficultyOptions as option}
				<option value={option.value} class="bg-minecraft-button text-white">
					{option.label}
				</option>
			{/each}
		</select>
	</div>

	<div class="flex items-center gap-2">
		<div class="flex items-center gap-1">
			<img
				src="/icons/time.png"
				alt="Time"
				class="h-6 w-6 object-cover"
				style="image-rendering: pixelated;"
				draggable="false"
			/>
			<Timer seconds={time} />
		</div>

		<div class="flex items-center gap-1">
			<img
				src="/icons/flags_left.png"
				alt="Flags"
				class="h-6 w-6 object-cover"
				style="image-rendering: pixelated;"
				draggable="false"
			/>
			<span class="w-[2rem] text-center">{flags}</span>
		</div>
	</div>
</Button>
