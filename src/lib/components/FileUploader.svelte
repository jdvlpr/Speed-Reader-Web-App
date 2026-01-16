<script lang="ts">
  import { DEFAULT_TEXT } from '$lib/constants';
	import { reader } from '$lib/stores/settings.svelte';
	import { fetchDailyArticle } from '$lib/utils/wikipedia';
  import { BookOpenIcon, RotateCcwIcon, XIcon, LoaderIcon } from '@lucide/svelte';

	let textInput = $state('');
	let dragActive = $state(false);
	let fetching = $state(false);

	function handleFileUpload(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			readFile(file);
		}
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		dragActive = false;

		const file = event.dataTransfer?.files[0];
		if (file) {
			readFile(file);
		}
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		dragActive = true;
	}

	function handleDragLeave() {
		dragActive = false;
	}

	function readFile(file: File) {
		if (!file.name.endsWith('.txt')) {
			alert('Please upload a .txt file');
			return;
		}

		const fileReader = new FileReader();
		fileReader.onload = (e) => {
			const text = e.target?.result as string;
			if (text) {
				reader.loadNewText(text);
			}
		};
		fileReader.onerror = () => {
			alert('Error reading file');
		};
		fileReader.readAsText(file);
	}

	function handlePaste() {
		if (textInput.trim()) {
			reader.loadNewText(textInput);
			textInput = '';
		}
	}
</script>

<div class="fixed inset-0 bg-black/70 flex items-center justify-center z-1000 p-4" onclick={() => (reader.showUploader = false)}>
	
	<div class="bg-surface-50 dark:bg-surface-900 p-4 rounded-2xl max-w-[500px] w-full max-h-[90vh] overflow-y-auto" onclick={(e) => e.stopPropagation()}>		
		<div class="flex flex-col items-end gap-2">
			<button class="btn hover:preset-filled w-fit" onclick={() => (reader.showUploader = false)}>
				<XIcon/>
				</button>

			<!-- Text Paste Area -->
			<div class="flex flex-col gap-2 w-full">
				<label for="text-paste" class="label">
					<textarea
						id="text-paste"
						bind:value={textInput}
						placeholder="Paste your text here..."
						class="w-full p-3 rounded-md border border-surface-500/30 bg-surface-100 dark:bg-surface-800 text-surface-900 dark:text-surface-50 resize-y"
						rows="4"
					></textarea>
				</label>
				
				<div class="flex flex-wrap gap-4">
					<button
					class="btn hover:preset-filled"
					onclick={handlePaste}
					disabled={!textInput.trim()}
				>
					Load Text
				</button>

				</div>
			</div>

			<div class="text-center w-full my-6 relative opacity-60 bg-surface-50 dark:bg-surface-900 inline-block px-4 before:content-[''] before:absolute before:inset-x-0 before:top-1/2 before:h-px before:bg-surface-500/30 before:-z-10">OR</div>

			<div class="flex flex-row flex-wrap justify-center gap-4 mx-auto">
				<button class="btn hover:preset-filled w-fit" onclick={() => reader.loadNewText(DEFAULT_TEXT)}>
					<RotateCcwIcon/> Use Default Text
				</button>
				
				<button 
					class="btn hover:preset-filled w-fit" 
					disabled={fetching}
					onclick={async () => {
						fetching = true;
						const article = await fetchDailyArticle();
						if (article) reader.loadNewText(article);
						fetching = false;
					}}
				>
					{#if fetching}
						<LoaderIcon class="animate-spin" /> Loading...
					{:else}
						<BookOpenIcon/> Read Today's Article
					{/if}
				</button>
			</div>

			<div class="text-center w-full my-6 relative opacity-60 bg-surface-50 dark:bg-surface-900 inline-block px-4 before:content-[''] before:absolute before:inset-x-0 before:top-1/2 before:h-px before:bg-surface-500/30 before:-z-10">OR</div>

			<!-- File Upload -->
			<div
				class={["border-2 border-dashed border-surface-500/40 rounded-lg p-8 text-center transition-opacity duration-200 mb-4 w-full", dragActive ? 'border-blue-500' : 'bg-blue-500/10']}
				ondrop={handleDrop}
				ondragover={handleDragOver}
				ondragleave={handleDragLeave}
			>
				<p class="text-lg mb-2">Drop a .txt file here or</p>
				<label for="file-input" class="btn variant-filled-primary cursor-pointer">
					Choose File
				</label>
				<input
					id="file-input"
					type="file"
					accept=".txt"
					onchange={handleFileUpload}
					class="hidden"
				/>
			</div>	
		</div>	
	</div>
</div>
