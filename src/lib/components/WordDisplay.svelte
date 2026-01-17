<script lang="ts">
	import { reader } from '$lib/stores/settings.svelte';
	import { onDestroy } from 'svelte';
	import ProgressBar from './ProgressBar.svelte';

	let timeoutId: ReturnType<typeof setTimeout> | null = null;

	let currentWord = $derived(reader.words[reader.currentIndex] || { text: 'Welcome', orp: 2, pauseAfter: 0, punctuation: '' });
	let beforeORP = $derived(currentWord.text.slice(0, currentWord.orp));
	let orpChar = $derived(currentWord.text[currentWord.orp] || '');
	let afterORP = $derived(currentWord.text.slice(currentWord.orp + 1));

	function calculateDelay(): number {

		let wpm = reader.wpm;

		if (reader.easeUp && reader.playbackStartTime !== null && reader.wpm > 500) {
			const elapsed = (Date.now() - reader.playbackStartTime) / 1000;
			if (elapsed < reader.easeUpSeconds) {
				// Start at 60% of target WPM and ease up to 100%
				const startPercent = 0.2;
				const progress = elapsed / reader.easeUpSeconds;
				let currentPercent = startPercent + (1 - startPercent) * progress;
				wpm = reader.wpm * currentPercent;
			}
		}

		const baseDelay = (60000 / wpm); // milliseconds per word
		const pause = currentWord.pauseAfter;
		return baseDelay + pause;
	}

	function advance() {
		if (reader.currentIndex < reader.words.length - 1) {
			reader.currentIndex++;
			scheduleNext();
		} else {
			// Reached the end
			reader.playing = false;
		}
	}

	function scheduleNext() {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}

		if (reader.playing) {
			timeoutId = setTimeout(advance, calculateDelay());
		}
	}

	let containerWidth = $state(0);
	let beforeWidth = $state(0);
	let orpWidth = $state(0);
	let afterWidth = $state(0);

	let effectiveWidth = $derived(2.5 * Math.max(beforeWidth, afterWidth) + orpWidth * 3.5);
	let scale = $derived(containerWidth > 0 && effectiveWidth > containerWidth - 40 ? (containerWidth - 40) / effectiveWidth : 1);

	// Handle playing state changes
	$effect(() => {
		if (reader.playing) {
			scheduleNext();
		} else if (timeoutId) {
			clearTimeout(timeoutId);
			timeoutId = null;
		}
	});

	// Cleanup on unmount
	onDestroy(() => {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}
	});
</script>

<div 
	class="flex items-center justify-center select-none w-full overflow-hidden" 
	style:font-family={reader.fontFamily}
	bind:clientWidth={containerWidth}
>
	<div class="flex flex-col gap-2 w-full items-center">
		<div class="flex w-full">
			<div class="border-t border-surface-100-900 w-full"></div>
			<div class="w-0 h-10 border-l border-surface-100-900"></div>
			<div class="border-t border-surface-100-900 w-full"></div>
		</div>
		<div 
			class="flex origin-center whitespace-nowrap w-fit will-change-transform"
			style="transform: scale({scale});font-size: {reader.fontSize}px;"
			>
			<div 
				class="flex w-full"
			>
				<div 
					bind:clientWidth={beforeWidth}
					class="flex-1 flex items-center justify-end text-right min-w-0"
				>
					{beforeORP}
				</div>
				<div 
					bind:clientWidth={orpWidth}
					class="flex-none flex items-center justify-center dark:text-red-400 text-red-600"
				>
					{orpChar}
				</div>
				<div 
					bind:clientWidth={afterWidth}
					class="flex-1 flex items-center justify-start text-left min-w-0"
				>
					{afterORP}
				</div>
			</div>
		</div>
		<div class="flex flex-col w-full">
			<div class="flex w-full">
				<div class="border-b border-surface-100-900 w-full"></div>
				<div class="w-0 h-10 border-l border-surface-100-900"></div>
				<div class="border-b border-surface-100-900 w-full flex justify-end items-end">
					<span class="p-2 text-surface-200-800">{reader.wpm} wpm</span>
				</div>
			</div>
			
			<ProgressBar />
		</div>
		
	</div>
</div>
