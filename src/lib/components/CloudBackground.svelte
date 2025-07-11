<script lang="ts">
	import clsx from 'clsx';

	const cloudClasses = clsx(
		'top-0',
		'left-0',
		'w-full',
		'h-full',
		'bg-repeat-x',
		'bg-[length:1000%_auto]',
    'bg-[url("/bg/clouds.png")]',
    'dark:brightness-10 z-0'
	);

  const cloudBackgroundClasses = clsx(
    'fixed',
    'z-[-1]',
    'w-screen',
    'h-screen',
    'bg-blue-300 dark:bg-gray-950 dark:brightness-10',
  )
</script>

<!-- for moon/stars/sun or other purposes later-->
<div class="fixed z-[-1] w-screen h-screen">
  <div class={cloudBackgroundClasses}></div>
	<div id="cloud-background" class={cloudClasses}></div>
</div>

<style>
	#cloud-background {
		animation: scrollClouds 600s linear infinite;
		image-rendering: pixelated;
	}

	@keyframes scrollClouds {
		from {
			background-position: 50% 0;
		}
		to {
			background-position: 150% 5%;
		}
	}
</style>
