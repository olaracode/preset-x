<script lang="ts">
	export let active: boolean;
	export let color: 'green' | 'red' | 'amber' = 'green';
	export let size: 'sm' | 'md' = 'md';

	// Reactive variable for CSS classes
	$: sizeClass = size === 'sm' ? 'led-small' : 'led-medium';

	$: colorClass = active
		? {
				green: 'led-active-green',
				red: 'led-active-red',
				amber: 'led-active-amber'
			}[color]
		: 'led-inactive';
</script>

<div class={`led-indicator ${sizeClass} ${colorClass}`}></div>

<style>
	.led-indicator {
		border-radius: 50%;
		border: 1px solid #333;
		transition: all 300ms ease;
	}

	/* Sizes */
	.led-small {
		width: 8px;
		height: 8px;
	}
	.led-medium {
		width: 12px;
		height: 12px;
	}

	/* Inactive State */
	.led-inactive {
		background-color: #333;
		box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.8);
	}

	/* Active States */
	.led-active-green {
		background-color: #a0ff00;
		/* Custom shadow based on the provided tailwind class equivalent for a glow */
		box-shadow: 0 0 8px rgba(160, 255, 0, 0.6);
	}
	.led-active-red {
		background-color: #ff4a4a;
		box-shadow: 0 0 8px rgba(255, 74, 74, 0.6);
	}
	.led-active-amber {
		background-color: #ffc107;
		box-shadow: 0 0 8px rgba(255, 193, 7, 0.6);
	}
</style>
