<script lang="ts">
	import { onMount } from 'svelte';

	export let value: string | undefined = undefined;
	export let options: string[] = [];
	export let placeholder: string = 'Select an option';
	export let disabled: boolean = false;

	let isOpen = false;
	let selectElement: HTMLElement;

	function toggle() {
		if (!disabled) {
			isOpen = !isOpen;
		}
	}

	function select(option: string) {
		value = option;
		isOpen = false;
	}

	function handleClickOutside(event: MouseEvent) {
		if (selectElement && !selectElement.contains(event.target as Node)) {
			isOpen = false;
		}
	}

	onMount(() => {
		document.addEventListener('click', handleClickOutside, true);
		return () => {
			document.removeEventListener('click', handleClickOutside, true);
		};
	});
</script>

<div class="select-container" bind:this={selectElement}>
	<button class="select-trigger" on:click={toggle} {disabled}>
		<span class:placeholder={!value}>{value || placeholder}</span>
		<svg
			class="select-arrow"
			style="transform: rotate({isOpen ? '180deg' : '0deg'});"
			viewBox="0 0 24 24"
		>
			<path fill="currentColor" d="M7 10l5 5 5-5z" />
		</svg>
	</button>

	{#if isOpen}
		<div class="select-content">
			{#each options as option (option)}
				<div
					class="select-item"
					class:selected={value === option}
					on:click={() => select(option)}
					on:keydown={(e) => e.key === 'Enter' && select(option)}
					role="option"
					aria-selected={value === option}
					tabindex="0"
				>
					{option}
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.select-container {
		position: relative;
	}
	.select-trigger {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		height: 48px;
		background-color: #0a0a0a;
		border: 2px solid #3a3a3a;
		color: #a0ff00;
		font-family: monospace;
		padding: 0 12px;
		border-radius: 4px;
		font-size: 16px;
		cursor: pointer;
		text-align: left;
	}
	.select-trigger:focus {
		outline: none;
		border-color: #a0ff00;
		box-shadow: 0 0 0 1px #a0ff00;
	}
	.select-trigger:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	.placeholder {
		color: #666;
	}
	.select-arrow {
		width: 20px;
		height: 20px;
		transition: transform 0.2s ease-in-out;
	}
	.select-content {
		position: absolute;
		width: 100%;
		top: 100%;
		left: 0;
		right: 0;
		background-color: #0a0a0a;
		border: 2px solid #3a3a3a;
		border-radius: 4px;
		margin-top: 4px;
		z-index: 10;
		max-height: 200px;
		overflow-y: auto;
	}
	.select-item {
		padding: 8px 12px;
		cursor: pointer;
		color: white;
		font-family: monospace;
	}
	.select-item:hover {
		background-color: #3a3a3a;
	}
	.select-item.selected {
		background-color: #a0ff00;
		color: #0a0a0a;
	}
</style>
