<script lang="ts">
	import {
		Zap,
		Waves,
		Volume2,
		Radio,
		ShieldOff,
		Sliders,
		Repeat,
		Clock,
		Sparkles
	} from 'lucide-svelte';

	// Define component properties
	export let type: string;
	export let name: string;
	export let isOn: boolean;
	export let settings: Record<string, string | number>;
	export let color: string; // Now expects a direct CSS linear-gradient string

	const pedalIcons = {
		FX: Zap,
		DS: Waves,
		AMP: Volume2,
		CAB: Radio,
		NR: ShieldOff,
		EQ: Sliders,
		MOD: Repeat,
		DLY: Clock,
		RVB: Sparkles
	};

	// Logic for icon selection
	$: Icon = pedalIcons[type as keyof typeof pedalIcons] || Sliders;
	$: settingsArray = Object.entries(settings);

	// Helper function to combine classes conditionally (manually implementing cn logic)
	function cn(...classes: (string | boolean | undefined)[]) {
		return classes.filter(Boolean).join(' ');
	}

	// Reactive class for the main pedal container
	$: mainClass = cn('pedal-container', isOn ? 'is-on' : 'is-off');

	// Reactive class for the LED
	$: ledClass = cn('pedal-led', isOn ? 'led-on' : 'led-off');

	// Function to calculate rotation (based on value being 0-10)
	function calculateRotation(value: string | number): string {
		if (typeof value === 'number') {
			// Assuming max value is 10 for a full 270-degree sweep (starting at -135deg)
			const degrees = (value / 10) * 270 - 135;
			return `translateX(-50%) rotate(${degrees}deg)`;
		}
		return `translateX(-50%) rotate(0deg)`; // Default for non-numeric settings
	}
</script>

<div class={mainClass} style="background-image: {color};">
	<div class="icon-section">
		<div class="icon-circle">
			<svelte:component this={Icon} class="icon-style" />
		</div>
		<div class={ledClass} />
	</div>

	<div class="info-section">
		<div class="header">
			<div class="type-label">{type}</div>
			<div class="name-label">{name}</div>
		</div>

		<div class="parameters-grid">
			{#each settingsArray as [key, value]}
				<div class="parameter-item">
					<div class="knob-housing">
						<div class="knob-base" />
						<div class="knob-indicator" style="transform: {calculateRotation(value)};" />
					</div>
					<div class="parameter-labels">
						<div class="param-key">{key}</div>
						<div class="param-value">
							{typeof value === 'number' ? value.toFixed(1) : value}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	/* --- Component Variables and Setup --- */

	/* Fallback/Base styles */
	.pedal-container {
		position: relative;
		display: flex;
		align-items: center;
		gap: 24px;
		border-radius: 12px;
		padding: 24px;
		transition: all 300ms ease;
		border-width: 2px;
		border-style: solid;
		box-shadow: 0 10px 15px rgba(0, 0, 0, 0.3); /* shadow-lg */
	}

	/* --- Dynamic State Styles --- */
	.is-on {
		opacity: 1;
		border-color: rgba(255, 255, 255, 0.2); /* border-white/20 */
	}

	.is-off {
		opacity: 0.5;
		border-color: rgba(255, 255, 255, 0.1); /* border-white/10 */
	}

	/* --- LED Indicator --- */
	.pedal-led {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		transition: all 300ms ease;
	}

	.led-on {
		background-color: #ef4444; /* bg-red-500 */
		box-shadow: 0 0 12px rgba(239, 68, 68, 0.9);
	}

	.led-off {
		background-color: rgba(113, 113, 122, 0.5); /* bg-zinc-700/50 */
	}

	/* --- Icon Section --- */
	.icon-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		flex-shrink: 0;
	}

	.icon-circle {
		width: 64px; /* w-16 */
		height: 64px; /* h-16 */
		border-radius: 50%;
		background-color: rgba(0, 0, 0, 0.3); /* bg-black/30 */
		display: flex;
		align-items: center;
		justify-content: center;
		backdrop-filter: blur(4px); /* backdrop-blur-sm */
		border-width: 2px;
		border-color: rgba(255, 255, 255, 0.2); /* border-white/20 */
	}

	.icon-style {
		width: 32px; /* w-8 */
		height: 32px; /* h-8 */
		color: white;
		filter: drop-shadow(0 4px 3px rgba(0, 0, 0, 0.25)); /* drop-shadow-lg */
	}

	/* --- Info Section (Text and Parameters) --- */
	.info-section {
		flex: 1;
		min-width: 0;
	}

	.header {
		margin-bottom: 16px; /* mb-4 */
	}

	.type-label {
		font-size: 12px; /* text-xs */
		font-weight: bold;
		color: rgba(255, 255, 255, 0.8); /* text-white/80 */
		letter-spacing: 0.1em; /* tracking-widest */
		text-transform: uppercase;
		margin-bottom: 4px; /* mb-1 */
	}

	.name-label {
		font-size: 20px; /* text-xl */
		font-weight: bold;
		color: white;
		filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5)); /* drop-shadow-md */
	}

	/* --- Parameter Grid --- */
	.parameters-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr)); /* grid-cols-4 */
		gap: 16px; /* gap-4 */
	}

	.parameter-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px; /* gap-2 */
	}

	/* --- Knob Styles --- */
	.knob-housing {
		position: relative;
		width: 48px; /* w-12 */
		height: 48px; /* h-12 */
		border-radius: 50%;
		background-color: rgba(0, 0, 0, 0.4); /* bg-black/40 */
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2); /* shadow-lg */
		border-width: 2px;
		border-color: rgba(255, 255, 255, 0.2); /* border-white/20 */
		backdrop-filter: blur(4px); /* backdrop-blur-sm */
	}

	.knob-base {
		position: absolute;
		inset: 4px; /* inset-1 */
		border-radius: 50%;
		background-image: linear-gradient(
			to bottom right,
			#3f3f46,
			#18181b
		); /* from-zinc-800 to-zinc-900 */
	}

	.knob-indicator {
		position: absolute;
		top: 8px; /* top-2 */
		left: 50%;
		width: 4px; /* w-1 */
		height: 16px; /* h-4 */
		background-color: white;
		border-radius: 9999px; /* rounded-full */
		transform-origin: bottom center; /* For rotation style calculation */
		filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.2)); /* drop-shadow-lg */
	}

	/* --- Parameter Labels --- */
	.parameter-labels {
		text-align: center;
	}

	.param-key {
		font-size: 12px; /* text-xs */
		font-weight: bold;
		color: white;
		text-transform: uppercase;
		letter-spacing: 0.05em; /* tracking-wide */
		filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.3)); /* drop-shadow-md */
	}

	.param-value {
		font-size: 12px; /* text-xs */
		font-weight: 600; /* font-semibold */
		color: rgba(255, 255, 255, 0.9); /* text-white/90 */
		filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.2)); /* drop-shadow-sm */
	}
</style>
