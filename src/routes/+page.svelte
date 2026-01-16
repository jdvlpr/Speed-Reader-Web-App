<script lang="ts">
	import FileUploader from '$lib/components/FileUploader.svelte';
	import ReaderControls from '$lib/components/ReaderControls.svelte';
	import SpeedControl from '$lib/components/SpeedControl.svelte';
	import WordDisplay from '$lib/components/WordDisplay.svelte';
	import { DEFAULT_TEXT } from '$lib/constants';
	import { reader } from '$lib/stores/settings.svelte';
	import { fetchDailyArticle } from '$lib/utils/wikipedia';
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
							reader.loadNewText(article);
						} else {
							reader.loadNewText(DEFAULT_TEXT);
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
		</div>
	{/if}

{#if reader.showUploader}
	<FileUploader />
{/if}
