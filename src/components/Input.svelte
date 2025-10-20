<script lang="ts">
	// Export these props for use with Svelte's bind:value and standard attributes
	export let value: string;
	export let placeholder: string = '';
	export let disabled: boolean = false;
	export let className: string = ''; // Allows external styling

	// Use $$restProps to pass through any other attributes (type, onChange, etc.)
</script>

<input
	type="text"
	bind:value
	{placeholder}
	{disabled}
	class={`form-input ${className}`}
	{...$$restProps}
/>

<style>
	/* Base styles inherited from PedalInterface.svelte for consistency */
	.form-input {
		height: 48px;
		background-color: #0a0a0a;
		border: 2px solid #3a3a3a;
		color: #a0ff00;
		font-family: monospace;
		padding: 0 12px;
		border-radius: 4px;
		width: 100%;
		box-sizing: border-box;
		font-size: 16px;
	}
	.form-input::placeholder {
		color: #666;
	}
	.form-input:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	.form-input:focus {
		outline: none;
		border-color: #a0ff00;
		box-shadow: 0 0 0 1px #a0ff00;
	}
</style>
