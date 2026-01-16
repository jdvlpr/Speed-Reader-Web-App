<script lang="ts">
	import { reader } from "$lib/stores/settings.svelte";
  import { fetchRandomArticle } from "$lib/utils/wikipedia";
	import { ArrowLeftIcon, ArrowRightIcon, LoaderIcon, LucideShuffle, PauseIcon, PencilIcon, PlayIcon, RotateCcwIcon, ShuffleIcon } from "@lucide/svelte";

	let fetching = $state(false);

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
				<PencilIcon/> Edit <span class="max-sm:hidden">Text</span>
			</button>

			<button 
					class={["btn hover:preset-filled w-fit transition-opacity duration-1000", reader.playing ? "opacity-0 pointer-events-none" : 'opacity-100']} 
					disabled={fetching}
					onclick={async () => {
						fetching = true;
						const article = await fetchRandomArticle();
						if (article) {
							reader.loadArticle(article);
						}
						fetching = false;
					}}
				>
					{#if fetching}
						<LoaderIcon class="animate-spin" /> Loading...
					{:else}
						<ShuffleIcon/> <span class="max-sm:hidden">Wikipedia</span> Article
					{/if}
				</button>

			<button class={["btn hover:preset-filled transition-opacity duration-1000", reader.playing ? 'opacity-0 pointer-events-none' : 'opacity-100']} title="Reset text from beginning [R]" onclick={() => reader.reset()}>
				<RotateCcwIcon/> Restart
			</button>
		</div>

		<div class={["flex flex-col gap-4 max-w-3xl items-center mx-auto border rounded-full p-2 ", reader.playing ? 'border-surface-50-950' : 'border-surface-100-900']}>
			<div class="flex flex-wrap gap-2">
				<button class={["btn hover:preset-filled transition-opacity duration-1000 rounded-full", reader.playing ? 'opacity-0 pointer-events-none' : 'opacity-100']} title="Go back one word [Left Arrow]" onclick={() => reader.back()}>
					<ArrowLeftIcon size={32} />
				</button>
			
				<button class="btn hover:preset-filled rounded-full" title="Play/Pause [Space]" onclick={() => reader.togglePlay()}>
					{#if reader.playing}
						<PauseIcon size={48} />
					{:else}
						<PlayIcon size={48} />
					{/if}
				</button>

				<button class={["btn hover:preset-filled transition-opacity duration-1000 rounded-full", reader.playing ? 'opacity-0 pointer-events-none' : 'opacity-100']} title="Go forward one word [Right Arrow]" onclick={() => reader.forward()}>
					<ArrowRightIcon size={32} />
				</button>
			</div>
		</div>
	</div>
