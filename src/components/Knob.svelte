<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let label: string;
	export let value: number;
	export let min: number = 0;
	export let max: number = 100;

	const dispatch = createEventDispatcher();

	let isDragging: boolean = false;
	let startY: number = 0;
	let startValue: number = 0;

	// Reactive rotation calculation
	$: rotation = ((value - min) / (max - min)) * 270 - 135;

	function handleMouseDown(e: MouseEvent) {
		isDragging = true;
		startY = e.clientY;
		startValue = value;
	}

	function handleMouseMove(e: MouseEvent) {
		if (!isDragging) return;

		// Use svelte-style dispatch for updates
		const deltaY = startY - e.clientY;
		const sensitivity = 0.5;
		const newValue = Math.max(min, Math.min(max, startValue + deltaY * sensitivity));

		// Dispatch an event so the parent component can update the value binding
		dispatch('change', Math.round(newValue));
	}

	function handleMouseUp() {
		isDragging = false;
	}

	// Svelte reactive block for adding/removing global listeners
	$: if (isDragging) {
		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);
	} else {
		document.removeEventListener('mousemove', handleMouseMove);
		document.removeEventListener('mouseup', handleMouseUp);
	}
</script>

<div class="knob-container">
	<div
		on:mousedown={handleMouseDown}
		class="knob-body"
		style="background: radial-gradient(circle at 30% 30%, #4f4f7a, #2e2e4a);"
	>
		<div class="knob-indicator" style="transform: rotate({rotation}deg);">
			<div class="indicator-line"></div>
		</div>

		<div class="center-dot"></div>
	</div>

	<div class="knob-label-area">
		<label class="knob-label-text">{label}</label>
		<div class="knob-value">{value}</div>
	</div>
</div>

<style>
	.knob-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
	}

	.knob-body {
		position: relative;
		width: 80px;
		height: 80px;
		border-radius: 50%;
		border: 4px solid #333;
		box-shadow:
			0 4px 10px rgba(0, 0, 0, 0.5),
			inset 0 0 8px rgba(255, 255, 255, 0.1);
		cursor: pointer;
		user-select: none;
		transition: box-shadow 0.15s ease-in-out;
	}

	.knob-body:hover {
		box-shadow:
			0 6px 15px rgba(0, 0, 0, 0.7),
			inset 0 0 10px rgba(255, 255, 255, 0.15);
	}

	.knob-indicator {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: flex-start;
		justify-content: center;
		padding-top: 8px; /* Offset the indicator from the center */
		transform-origin: center center;
		pointer-events: none; /* Ignore clicks */
	}

	.indicator-line {
		width: 4px;
		height: 24px;
		background-color: #a0ff00; /* Primary color indicator */
		border-radius: 2px;
		box-shadow: 0 0 5px rgba(160, 255, 0, 0.8);
	}

	.center-dot {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background-color: #555;
		border: 1px solid #333;
	}

	.knob-label-area {
		text-align: center;
		min-height: 30px; /* To prevent layout shift */
	}
	.knob-label-text {
		font-size: 12px;
		font-family: monospace;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: #777;
		display: block;
		margin-bottom: 2px;
	}
	.knob-value {
		font-size: 14px;
		font-family: monospace;
		font-weight: bold;
		color: white;
	}
</style>
