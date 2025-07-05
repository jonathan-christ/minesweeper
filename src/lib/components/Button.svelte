<script lang="ts">
	import type { Snippet } from 'svelte';
	import { clsx } from 'clsx';
	import { twMerge } from 'tailwind-merge';
	import { Sound } from '$lib/audio';

	let {
		href,
		label = '',
		external = false,
		className = '',
		activeClassName = '',
		borderClassName = '',
		bevelClassName = '',
		marginClass = 'mt-[0.25rem]',
		isActive = false,
		toggleLock = false,
		activeHighlight = false,
		copyText = '',
		onclick = () => {},
		onmouseenter = () => {},
		onmouseleave = () => {},
		children
	}: {
		href?: string;
		label?: string;
		external?: boolean;
		className?: string;
		activeClassName?: string;
		borderClassName?: string;
		bevelClassName?: string;
		marginClass?: string;
		children?: Snippet;
		onclick?: () => void;
		onmouseenter?: () => void;
		onmouseleave?: () => void;
		isActive?: boolean;
		toggleLock?: boolean;
		activeHighlight?: boolean;
		copyText?: string;
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

	let active = $derived(isActive);

	const onclickHandler = () => {
		if (!active) {
			active = true;
			clickSound.play();
			onclick();
		}
		if (!toggleLock) {
			setTimeout(() => (active = false), 100);
		}
	};

	// Outer container classes
	const outerClasses = $derived(
		twMerge(
			clsx(
				Object.values(outerStyles),
				active && marginClass,
				!active &&
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
				active && ['bg-minecraft-active border-minecraft-active-border border-b-0', activeClassName]
			)
		)
	);

	const bevel = $derived(
		twMerge(
			clsx(
				'bottomBevels bg-minecraft-button-bevel',
				active && 'h-1 bg-minecraft-button-bevel-active',
				!active && 'h-[0.25rem]',
				bevelClassName
			)
		)
	);
	const highlight = $derived(twMerge(clsx(bevel, active && 'bg-white')));
	const soundSrc = `/audio/${href ? 'link_click.mp3' : 'button_click.mp3'}`;
	const clickSound = new Sound(soundSrc, { volume: 0.5 });
</script>

{#snippet Content()}
	<div class={innerClasses}>
		{@render children?.()}
		<p class="font-title font-[100]">{label.toUpperCase()}</p>
	</div>
	<!-- bottom padding -->
	{#if activeHighlight}
		<div class="grid w-full grid-cols-[2fr_1fr_2fr]">
			<div class={bevel}></div>
			<div class={highlight}></div>
			<div class={bevel}></div>
		</div>
	{:else}
		<div class={`${bevel} w-full`}></div>
	{/if}
{/snippet}

{#if href}
	<a
		{href}
		class={outerClasses}
		target={external ? '_blank' : undefined}
		rel={external ? 'noopener noreferrer' : undefined}
		onclick={onclickHandler}
		onmouseenter={onmouseenter}
		{onmouseleave}
	>
		{@render Content()}
	</a>
{:else}
	<button class={outerClasses} onclick={onclickHandler} onmouseenter={onmouseenter} {onmouseleave}>
		{@render Content()}
	</button>
{/if}
