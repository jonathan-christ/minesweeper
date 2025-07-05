<script lang="ts">
    import type { Writable } from "svelte/store";
    import { onDestroy } from "svelte";
    
    let { seconds }: { seconds: Writable<number> | undefined } = $props();

    let currentSeconds = $state(0);
    
    // Subscribe to the store and update currentSeconds
    const unsubscribe = seconds?.subscribe(value => {
        currentSeconds = value;
    });
    
    // Clean up subscription on component destroy
    onDestroy(() => {
        unsubscribe?.();
    });

    const minutes = $derived(Math.floor(currentSeconds / 60));
    const displaySeconds = $derived(currentSeconds % 60);
</script>

<div class="flex flex-row items-center justify-center gap-2 w-[4rem]">
    {minutes.toString().padStart(2, '0')}:{displaySeconds.toString().padStart(2, '0')}
</div>