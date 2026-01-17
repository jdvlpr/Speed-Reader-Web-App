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
			<button class={["btn hover:preset-tonal transition-opacity duration-1000 text-sm", reader.playing ? 'opacity-0 pointer-events-none' : 'opacity-100']} title="Edit text" onclick={() => (reader.showUploader = true)}>
				<PencilIcon/> <span class="max-sm:hidden">Edit</span>
			</button>

			<button 
					class={["btn hover:preset-tonal w-fit transition-opacity duration-1000 text-sm", reader.playing ? "opacity-0 pointer-events-none" : 'opacity-100']} 
					disabled={fetching}
					title="Load a random Wikipedia Article"
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
						<LoaderIcon class="animate-spin" /> <span class="max-sm:hidden">Loading...</span>
					{:else}
						<ShuffleIcon/> <span class="max-sm:hidden">Wikipedia Article</span>
					{/if}
				</button>

			<button class={["btn hover:preset-tonal transition-opacity duration-1000 text-sm", reader.playing ? 'opacity-0 pointer-events-none' : 'opacity-100']} title="Restart text from beginning [R]" onclick={() => reader.reset()}>
				<RotateCcwIcon/> <span class="max-sm:hidden">Restart</span>
			</button>
		</div>

		<div class={["flex flex-col gap-4 max-w-3xl items-center mx-auto border rounded-full p-2 ", reader.playing ? 'border-surface-50-950' : 'border-surface-100-900']}>
			<div class="flex flex-wrap gap-2">
				<button class={["btn hover:preset-tonal transition-opacity duration-1000 rounded-full", reader.playing ? 'opacity-0 pointer-events-none' : 'opacity-100']} title="Go back one word [Left Arrow]" onclick={() => reader.back()}>
					<ArrowLeftIcon size={32}/>
				</button>
			
				<button class="btn hover:preset-tonal rounded-full transition-opacity" title="Play/Pause [Space]" onclick={() => reader.togglePlay()}>
					{#if reader.playing}
						<PauseIcon size={48} class="dark:fill-white fill-black"  />
					{:else}
						<PlayIcon size={48} class="dark:fill-white fill-black" />
					{/if}
				</button>

				<button class={["btn hover:preset-tonal transition-opacity duration-1000 rounded-full", reader.playing ? 'opacity-0 pointer-events-none' : 'opacity-100']} title="Go forward one word [Right Arrow]" onclick={() => reader.forward()}>
					<ArrowRightIcon size={32} />
				</button>
			</div>
		</div>
	</div>
