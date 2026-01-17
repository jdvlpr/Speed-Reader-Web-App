<script lang="ts">
	import FileUploader from '$lib/components/FileUploader.svelte';
	import ReaderControls from '$lib/components/ReaderControls.svelte';
	import SpeedControl from '$lib/components/SpeedControl.svelte';
	import WordDisplay from '$lib/components/WordDisplay.svelte';
	import { DEFAULT_TEXT } from '$lib/constants';
	import { reader } from '$lib/stores/settings.svelte';
	import { fetchDailyArticle } from '$lib/utils/wikipedia';
  import { ExternalLinkIcon } from '@lucide/svelte';
	import { onMount } from 'svelte';

	

	// Load default text if no words are present on mount
	let loading = $state(true);

	onMount(() => {

		// Load default text if no words are present
		$effect.root(() => {
			$effect(() => {
				if (!reader.initialized) return;

				if (reader.text === "" && reader.words.length === 0) {
					fetchDailyArticle().then((article) => {
						if (article) {
							reader.loadArticle(article);
						} else {
							reader.loadNewText(DEFAULT_TEXT);
							reader.clearArticle();
						}
						loading = false;
					});
				} else {
					loading = false;
				}
			});
		});
	});
</script>

	

	{#if loading}
		<div class="flex flex-col items-center justify-center min-h-[50vh] gap-4">
			<div class="animate-pulse text-surface-400">Loading...</div>
		</div>
	{:else}
		<div class="flex flex-col bg-surface-50-950 justify-start gap-4 w-full mt-8">

			<WordDisplay />
			
			<ReaderControls />
			
			<SpeedControl />

			{#if reader.article.title && reader.article.href}
				<div class={["flex px-2 flex-row flex-wrap gap-2 mx-auto transition-opacity duration-1000 text-surface-400-600", reader.playing ? 'opacity-0 pointer-events-none' : 'opacity-100']}>
					Wikipedia Article: <a href={reader.article.href} target="_blank" rel="noopener noreferrer" class="underline text-sm flex items-center gap-1 hover:text-primary-500">
						<ExternalLinkIcon size={16} /> {reader.article.title}
					</a>
				</div>
			{/if}
		</div>
	{/if}

{#if reader.showUploader}
	<FileUploader />
{/if}
