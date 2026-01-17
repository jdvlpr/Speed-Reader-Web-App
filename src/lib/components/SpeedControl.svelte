<script lang="ts">
	import type { FontOption, FontSize } from '$lib/types';
	import { settings } from '$lib/stores/settings.svelte';
  import { MoonIcon, SunIcon } from '@lucide/svelte';

	const fontOptions: FontOption[] = [
		{ name: 'Adobe Garamond Pro', value: 'adobe-garamond-pro' },
		{ name: 'Arial', value: 'arial' },
		{ name: 'Museo', value: 'museo' },
		{ name: 'Museo Sans', value: 'museo-sans' },
	];

	const fontSizes: FontSize[] = [
		{ name: 'Small', value: 48 },
		{ name: 'Medium', value: 64 },
		{ name: 'Large', value: 80 },
		{ name: 'X-Large', value: 96 }
	];

	function toggleDarkMode() {
		if (typeof document !== 'undefined') {
			document.documentElement.classList.toggle('dark');
			settings.darkMode = !settings.darkMode;
		}
	}
</script>

<div class={["flex flex-col gap-4 items-center justify-center max-w-3xl mx-auto transition-opacity duration-1000 max-sm:p-2", settings.playing ? 'opacity-0 pointer-events-none' : 'opacity-100']}>
	<label for="wpm-slider" class="label w-full" title="Change Words Per Minute [Up Arrow]/[Down Arrow]">
		<span class="label-text">Words Per Minute: {settings.wpm}</span>
		<input
			id="wpm-slider"
			type="range"
			min="100"
			max="1500"
			step="5"
			bind:value={settings.wpm}
			class="input"
		/>
	</label>
	<div class="flex flex-wrap gap-4 items-center justify-center">
		<label for="font-select" class="label w-fit">
			<span class="label-text">Font</span>
			<select
				id="font-select"
				class="select"
				bind:value={settings.fontFamily}
			>
				{#each fontOptions as font}
					<option value={font.value}>{font.name}</option>
				{/each}
			</select>
		</label>

		<label for="size-select" class="label w-fit">
			<span class="label-text">Size</span>
			<select
				id="size-select"
				class="select"
				bind:value={settings.fontSize}
			>
				{#each fontSizes as size}
					<option value={size.value}>{size.name}</option>
				{/each}
			</select>
		</label>
	</div>

	<div class="flex gap-2">
		<button class="btn hover:preset-tonal w-fit m-2" title="Toggle Light/Dark mode" onclick={toggleDarkMode}>
			{#if settings.darkMode}
			<MoonIcon/>
			{:else}
			<SunIcon/>
			{/if} Theme
		</button>
	</div>

	
</div>
