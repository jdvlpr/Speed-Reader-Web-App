<script lang="ts">
	import FileUploader from '$lib/components/FileUploader.svelte';
	import ReaderControls from '$lib/components/ReaderControls.svelte';
	import SpeedControl from '$lib/components/SpeedControl.svelte';
	import WordDisplay from '$lib/components/WordDisplay.svelte';
	import { DEFAULT_TEXT } from '$lib/constants';
	import { reader } from '$lib/stores/settings.svelte';
	import { onMount } from 'svelte';

	

	// Load default text if no words are present on mount
	onMount(() => {

		// Load default text if no words are present
		$effect.root(() => {
			$effect(() => {
				if (reader.words.length === 0 && !reader.text) {
					reader.loadNewText(DEFAULT_TEXT);
				}
			});
		});
	});
</script>

	

	<div class="flex flex-col bg-surface-50-950 justify-start gap-4 w-full mt-8">

		<WordDisplay />

		<ReaderControls />

		<SpeedControl />
	</div>

{#if reader.showUploader}
	<FileUploader />
{/if}
