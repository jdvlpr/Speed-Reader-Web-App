<script lang="ts">
	import { reader } from '$lib/stores/settings.svelte';

	let progress = $derived(reader.words.length > 0 ? (reader.currentIndex / reader.words.length) * 100 : 0);

	function handleClick(e: MouseEvent) {
		const target = e.currentTarget as HTMLElement;
		const rect = target.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const percent = x / rect.width;
		const newIndex = Math.floor(percent * reader.words.length);
		reader.seek(Math.max(0, Math.min(newIndex, reader.words.length - 1)));
	}
</script>

<div class={["h-2 bg-surface-100-900 cursor-pointer relative overflow-hidden transition-opacity duration-1000 w-full", reader.playing ? 'opacity-0 pointer-events-none' : 'opacity-100']} onclick={handleClick} role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
	<div class="h-full bg-primary-200-800 transition-[width] duration-300 ease-linear" style:width="{progress}%"></div>
</div>
