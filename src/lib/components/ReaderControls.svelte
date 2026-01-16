<script lang="ts">
	import { reader } from "$lib/stores/settings.svelte";
	import { ArrowLeftIcon, ArrowRightIcon, PauseIcon, PencilIcon, PlayIcon, RotateCcwIcon } from "@lucide/svelte";

	// Keyboard shortcuts
	function handleKeydown(e: KeyboardEvent) {
		if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) {
			return; // Don't trigger shortcuts when typing
		}

		switch (e.key) {
			case ' ':
				e.preventDefault();
				reader.togglePlay();
				break;
			case 'ArrowUp':
				e.preventDefault();
				if (e.shiftKey) {
					reader.wpm += 50;
				} else {
					reader.wpm += 5;
				}
				break;
			case 'ArrowDown':
				e.preventDefault();
				if (e.shiftKey) {
					reader.wpm -= 50;
				} else {
					reader.wpm -= 5;
				}
				break;
			case 'ArrowLeft':
				e.preventDefault();
				reader.back();
				break;
			case 'ArrowRight':
				e.preventDefault();
				reader.forward();
				break;
			case 'r':
			case 'R':
				e.preventDefault();
				reader.reset();
				break;
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

	<div class="flex flex-col items-center gap-4 w-full">

		<div class="flex flex-wrap gap-4 items-center justify-center">
			<button class={["btn hover:preset-filled transition-opacity duration-1000", reader.playing ? 'opacity-0 pointer-events-none' : 'opacity-100']} title="Set text" onclick={() => (reader.showUploader = true)}>
				<PencilIcon/> Edit Text
			</button>

			<button class={["btn hover:preset-filled transition-opacity duration-1000", reader.playing ? 'opacity-0 pointer-events-none' : 'opacity-100']} title="Reset text from beginning [R]" onclick={() => reader.reset()}>
				<RotateCcwIcon/> Restart
			</button>
		</div>

		<div class="flex flex-col gap-4 max-w-3xl items-center mx-auto">
			<div class="flex flex-wrap gap-2">
				<button class={["btn hover:preset-filled transition-opacity duration-1000", reader.playing ? 'opacity-0 pointer-events-none' : 'opacity-100']} title="Go back one word [Left Arrow]" onclick={() => reader.back()}>
					<ArrowLeftIcon/> <span class="max-[335px]:hidden"> Back</span>
				</button>
			
				<button class="btn hover:preset-filled" title="Play/Pause [Space]" onclick={() => reader.togglePlay()}>
					{#if reader.playing}
						<PauseIcon/> Pause
					{:else}
						<PlayIcon/> Play
					{/if}
				</button>

				<button class={["btn hover:preset-filled transition-opacity duration-1000", reader.playing ? 'opacity-0 pointer-events-none' : 'opacity-100']} title="Go forward one word [Right Arrow]" onclick={() => reader.forward()}>
					<ArrowRightIcon/> <span class="max-[335px]:hidden"> Forward</span>
				</button>
			</div>
		</div>
	</div>
