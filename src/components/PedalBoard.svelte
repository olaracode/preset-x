<script lang="ts">
	import Pedal from './Pedal.svelte';

	// TypeScript interfaces (moved to the script block in Svelte)
	interface PedalData {
		'fx-block-name': string;
		'effect-name': string;
		'on/off': string;
		setting: Record<string, string | number>;
	}

	interface PedalBoardProps {
		preset: PedalData[];
	}

	// Export the property for the parent to pass data
	export let preset: PedalData[];

	// Color mapping for different pedal types
	const pedalColors = {
		FX: 'linear-gradient(to bottom right, #f59e0b, #d97706)', // from-yellow-500 to-yellow-600
		DS: 'linear-gradient(to bottom right, #ea580c, #c2410c)', // from-orange-600 to-orange-700
		AMP: 'linear-gradient(to bottom right, #dc2626, #b91c1c)', // from-red-600 to-red-700
		CAB: 'linear-gradient(to bottom right, #475569, #334155)', // from-slate-700 to-slate-800
		NR: 'linear-gradient(to bottom right, #9333ea, #7e22ce)', // from-purple-600 to-purple-700
		EQ: 'linear-gradient(to bottom right, #059669, #047857)', // from-emerald-600 to-emerald-700
		MOD: 'linear-gradient(to bottom right, #06b6d4, #0891b2)', // from-cyan-500 to-cyan-600
		DLY: 'linear-gradient(to bottom right, #2563eb, #1d4ed8)', // from-blue-600 to-blue-700
		RVB: 'linear-gradient(to bottom right, #4f46e5, #4338ca)' // from-indigo-600 to-indigo-700
	};

	// Helper function to get the correct color string
	function getPedalColor(type: string): string {
		return (
			pedalColors[type as keyof typeof pedalColors] ||
			'linear-gradient(to bottom right, #52525b, #3f3f46)' // from-gray-600 to-gray-700
		);
	}
</script>

<div class="pedalboard-wrapper">
	<div class="pedalboard-container">
		<div class="pedalboard-chain">
			{#each preset as pedal, index (index)}
				<Pedal
					type={pedal['fx-block-name']}
					name={pedal['effect-name']}
					isOn={pedal['on/off'] === 'on'}
					settings={pedal.setting}
					color={getPedalColor(pedal['fx-block-name'])}
				/>
			{/each}
		</div>
	</div>
</div>

<style>
	.pedalboard-wrapper {
		position: relative;
		max-width: 900px; /* max-w-5xl (Adjusted for better fit) */
		margin-left: auto;
		margin-right: auto;
	}

	.pedalboard-container {
		margin-top: 20px;
	}

	.pedalboard-chain {
		display: flex; /* Makes the pedal flow horizontally if possible */
		flex-direction: column; /* Forces vertical stacking for better layout */
		gap: 16px; /* space-y-4 */
	}
</style>
