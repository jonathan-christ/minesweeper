<script lang="ts">
	import type { Snippet } from 'svelte';
	import { clsx } from 'clsx';
	import { twMerge } from 'tailwind-merge';
	import { Sound } from '$lib/audio';
	import type { Difficulty } from '$lib/types';

	let {
		options = [],
		value = '',
		className = '',
		activeClassName = '',
		borderClassName = '',
		bevelClassName = '',
		marginClass = 'mt-[0.25rem]',
		icon,
		onchange = () => {},
		onmouseenter = () => {},
		onmouseleave = () => {}
	}: {
		options: Array<{ value: string; label: string }>;
		value?: string;
		className?: string;
		activeClassName?: string;
		borderClassName?: string;
		bevelClassName?: string;
		marginClass?: string;
		icon?: Snippet;
		onchange?: (difficulty: Difficulty) => void;
		onmouseenter?: () => void;
		onmouseleave?: () => void;
	} = $props();

	// Base styles for the outer container
	const outerStyles = {
		layout: 'w-full h-fit inline-flex items-center justify-center flex-col',
		background: 'bg-minecraft-button',
		borders: 'border-4 border-minecraft-border border-b-4'
	};

	// Base styles for the inner container
	const innerStyles = {
		layout: 'w-full inline-flex items-center justify-center',
		spacing: 'p-2 gap-2',
		typography: 'text-white',
		background: 'bg-minecraft-button-inner',
		borders: 'border-minecraft-border-inner border-b-minecraft-border-bottom border-4'
	};

	let isActive = $state(false);
	let selectElement = $state<HTMLSelectElement | null>(null);

	const handleContainerClick = (e: MouseEvent) => {
		// Don't interfere if user clicked directly on the select
		if (e.target === selectElement) return;
		e.preventDefault();

		if (selectElement) {
			clickSound.play();
			selectElement.focus();
			// Use the native showPicker method if available, fallback to click()
			if ('showPicker' in selectElement) {
				(selectElement as HTMLSelectElement).showPicker();
			} else {
				(selectElement as HTMLElement).click();
			}
		}
	};

	const handleSelectChange = (e: Event) => {
		const target = e.currentTarget as HTMLSelectElement;
		const newValue = target.value as Difficulty;
		onchange(newValue);
		// The blur will handle deactivating
		target.blur();
	};

	const handleSelectFocus = () => {
		isActive = true;
	};

	const handleSelectBlur = () => {
		isActive = false;
	};

	// Handle clicks on the select element itself
	const handleSelectClick = () => {
		if (!isActive) {
			clickSound.play();
		}
	};

	// Outer container classes
	const outerClasses = $derived(
		twMerge(
			clsx(
				Object.values(outerStyles),
				isActive && marginClass,
				!isActive &&
					'hover:*:cursor-pointer hover:*:bg-minecraft-hover hover:*:border-minecraft-hover-border hover:[&_.bottomBevels]:bg-minecraft-hover-bevel',
				'select-none',
				borderClassName
			)
		)
	);

	// Inner container classes
	const innerClasses = $derived(
		twMerge(
			clsx(
				Object.values(innerStyles),
				className,
				isActive && [
					'bg-minecraft-active border-minecraft-active-border border-b-0',
					activeClassName
				]
			)
		)
	);

	const bevel = $derived(
		twMerge(
			clsx(
				'bottomBevels bg-minecraft-button-bevel',
				isActive && 'h-1 bg-minecraft-button-bevel-active',
				!isActive && 'h-[0.25rem]',
				bevelClassName
			)
		)
	);

	const clickSound = new Sound('/audio/button_click.mp3', { volume: 0.5 });
</script>

<button class={outerClasses} onclick={handleContainerClick} {onmouseenter} {onmouseleave}>
	<div class={innerClasses}>
		{#if icon}
			<label for="difficulty-selector" class="pointer-events-none shrink-0">
				{@render icon()}
			</label>
		{/if}

		<select
			id="difficulty-selector"
			class="w-full cursor-pointer bg-transparent focus:outline-none"
			bind:this={selectElement}
			{value}
			onchange={handleSelectChange}
			onfocus={handleSelectFocus}
			onblur={handleSelectBlur}
			onclick={handleSelectClick}
		>
			{#each options as option (option.value)}
				<option value={option.value} class="bg-minecraft-button w-full text-white">
					{option.label}
				</option>
			{/each}
		</select>
	</div>

	<!-- Bottom bevel -->
	<div class={`${bevel} w-full`}></div>
</button>
