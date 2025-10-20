<script lang="ts">
	import type { GeneratedPreset } from '$lib/types';
	import Select from './Select.svelte';
	import Input from './Input.svelte';
	import { Battery, Wifi } from 'lucide-svelte';
	import { pedals } from '$lib/pedals';
	import PedalBoard from './PedalBoard.svelte';

	const PEDALS = pedals.map((p) => p.name);

	let selectedPedal: string | undefined = undefined;
	let toneDescription: string = '';
	let masterRotation: number = 0;
	let generatedPreset: GeneratedPreset | null = null;
	let isLoading = false;

	const handleMasterKnobClick = () => {
		const currentIndex = selectedPedal ? PEDALS.indexOf(selectedPedal) : -1;
		const nextIndex = (currentIndex + 1) % PEDALS.length;
		selectedPedal = PEDALS[nextIndex];
		masterRotation += 45;
	};

	const handleSubmit = async () => {
		isLoading = true;
		try {
			const response = await fetch('/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ selectedPedal, toneDescription })
			});

			if (!response.ok) {
				throw new Error('Failed to generate preset');
			}
			let parsedResponse = await response.json();
			console.log(parsedResponse);
			generatedPreset = parsedResponse;
		} catch (error) {
			console.error('Error:', error);
		} finally {
			isLoading = false;
		}
	};
</script>

<div class="pedal-interface-container">
	<div class="top-section">
		<div class="left-section">
			<div class="branding">
				<h1 class="branding-title">GE150Pro</h1>
				<p class="branding-subtitle">MultiEffects &amp; Amp Effects</p>
			</div>

			<div class="knob-group">
				<button
					aria-label="Master volume"
					on:click={handleMasterKnobClick}
					class="master-knob"
					style="transform: rotate({masterRotation}deg);"
				>
					<div class="master-knob-inner">
						<div class="master-knob-indicator"></div>
					</div>
				</button>
				<span class="knob-label">Master</span>
			</div>

			<div class="small-knobs-group">
				{#each ['TAP', 'DEEP TONE', 'SYSTEM'] as label (label)}
					<div class="small-knob-container">
						<button aria-label={label} class="small-knob">
							<div class="small-knob-inner">
								<div class="small-knob-indicator"></div>
							</div>
						</button>
						<span class="small-knob-label">{label}</span>
					</div>
				{/each}
			</div>
		</div>

		<div class="center-section">
			<div class="lcd-housing">
				<div class="lcd-header">
					<div class="lcd-icon-group">
						<Wifi class="icon-small" />
						<span class="lcd-header-text">NFC</span>
					</div>
					<div class="lcd-icon-group">
						<span class="lcd-header-text">100%</span>
						<Battery class="icon-medium" />
					</div>
				</div>

				<div class="lcd-display-area">
					{#if !selectedPedal}
						<div class="lcd-center-text">
							<div class="lcd-placeholder-dash">--</div>
							<div class="lcd-placeholder-text">Select Pedal</div>
						</div>
					{:else}
						<div class="lcd-pedal-name">{selectedPedal}</div>
					{/if}
				</div>
			</div>
		</div>

		<div class="right-section">
			<div class="knob-group">
				<span class="knob-label-top">Select</span>
				<button aria-label="Select" class="master-knob">
					<div class="master-knob-inner">
						<div class="master-knob-indicator"></div>
					</div>
				</button>
			</div>

			<div class="small-buttons-group">
				{#each ['PLAY', 'SAVE', 'EDIT'] as label (label)}
					<div class="small-button-container">
						<button aria-label={label} class="small-button"></button>
						<span class="small-knob-label">{label}</span>
					</div>
				{/each}
			</div>

			<div class="knob-group">
				<button aria-label="Mode" class="master-knob">
					<div class="master-knob-inner">
						<div class="master-knob-indicator"></div>
					</div>
				</button>
				<span class="knob-label">Mode</span>
			</div>
		</div>
	</div>

	<div class="bottom-section">
		<span class="in-out-label">IN</span>
		<div class="fx-chain">
			{#each ['FX', 'DG', 'AMP', 'CAB', 'NS', 'EQ', 'MOD', 'DLY', 'REV'] as label (label)}
				<div class="fx-block">
					<div class="fx-led"></div>
					<span class="fx-label">{label}</span>
				</div>
			{/each}
		</div>
		<span class="in-out-label">Out</span>
	</div>

	<div class="functional-controls">
		<div class="form-group">
			<label for="pedal-select" class="form-label">Target Pedal</label>
			<Select
				id="pedal-select"
				options={PEDALS}
				bind:value={selectedPedal}
				placeholder="Select your multi-effects pedal"
			/>
		</div>

		<div class="form-group">
			<label for="tone-description" class="form-label">Tone Description</label>
			<Input
				id="tone-description"
				placeholder={selectedPedal
					? 'e.g., "John Mayer blues tone" or "Metallica Master of Puppets"'
					: 'Select a pedal first...'}
				disabled={!selectedPedal}
				bind:value={toneDescription}
			/>
		</div>

		{#if selectedPedal && toneDescription}
			<div class="summary-box">
				<p><span class="summary-label">Pedal:</span> {selectedPedal}</p>
				<p><span class="summary-label">Target Tone:</span> {toneDescription}</p>
				<button
					on:click={handleSubmit}
					class="submit-button"
					disabled={!selectedPedal || !toneDescription || isLoading}
				>
					{#if isLoading}
						Generating...
					{:else}
						GENERATE PRESET
					{/if}
				</button>
			</div>
		{/if}
	</div>

	{#if generatedPreset}
		<PedalBoard preset={generatedPreset} />
	{/if}
</div>

<style>
	/* --- Pedal Interface Container Styles --- */
	.pedal-interface-container {
		width: 100%;
		margin: 20px 0px;
		max-width: 900px;
		background-color: #2a2a2a;
		border-radius: 8px;
		box-shadow:
			0 10px 30px rgba(0, 0, 0, 0.5),
			0 0 0 4px #1a1a1a;
		border: 4px solid #1a1a1a;
		padding: 24px;
	}

	/* --- Top Section Layout --- */
	.top-section {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		margin-bottom: 24px;
	}

	/* --- Left/Right Section Styles --- */
	.left-section,
	.right-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 24px;
	}

	/* --- Branding --- */
	.branding {
		text-align: left;
		margin-bottom: 8px;
	}
	.branding-title {
		color: white;
		font-size: 24px;
		font-weight: bold;
		letter-spacing: 0.1em;
	}
	.branding-subtitle {
		color: #999;
		font-size: 12px;
		letter-spacing: 0.05em;
	}

	/* --- Knobs and Indicators --- */
	.knob-group {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.knob-label {
		color: #999;
		font-size: 10px;
		margin-top: 8px;
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}
	.knob-label-top {
		color: #999;
		font-size: 12px;
		margin-bottom: 8px;
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	/* Master Knob */
	.master-knob {
		width: 96px;
		height: 96px;
		border-radius: 50%;
		background: linear-gradient(135deg, #3a3a3a, #1a1a1a);
		border: 4px solid #4a4a4a;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.15s ease-in-out;
	}
	.master-knob:hover {
		border-color: #5a5a5a;
	}
	.master-knob:active {
		transform: scale(0.95) rotate(0deg); /* Reset rotation on active to avoid complex style collision, keep the rotation on the style attribute */
	}

	.master-knob-inner {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		background-color: #1a1a1a;
		border: 2px solid #2a2a2a;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}
	.master-knob-indicator {
		width: 4px;
		height: 32px;
		background-color: #999;
		border-radius: 4px;
		position: absolute;
		top: 16px;
	}

	/* Small Knobs */
	.small-knobs-group {
		display: flex;
		gap: 12px;
		margin-top: 8px;
	}
	.small-knob-container {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.small-knob {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: linear-gradient(135deg, #3a3a3a, #1a1a1a);
		border: 2px solid #4a4a4a;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.small-knob-inner {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background-color: #1a1a1a;
		border: 1px solid #2a2a2a;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}
	.small-knob-indicator {
		width: 2px;
		height: 12px;
		background-color: #999;
		border-radius: 2px;
		position: absolute;
		top: 6px;
	}
	.small-knob-label {
		color: #777;
		font-size: 9px;
		margin-top: 4px;
		text-transform: uppercase;
	}

	/* Small Buttons */
	.small-buttons-group {
		display: flex;
		gap: 12px;
	}
	.small-button-container {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.small-button {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background-color: #1a1a1a;
		border: 2px solid #3a3a3a;
		box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.5);
	}

	/* --- Center Section (LCD) Styles --- */
	.center-section {
		flex: 1;
		margin: 0 24px;
	}
	.lcd-housing {
		background-color: #1a1a1a;
		border: 4px solid #0a0a0a;
		border-radius: 4px;
		padding: 16px;
		box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);
	}
	.lcd-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 8px;
		padding: 0 8px;
	}
	.lcd-icon-group {
		display: flex;
		align-items: center;
		gap: 4px;
		color: #777;
	}
	.icon-small {
		width: 12px;
		height: 12px;
	}
	.icon-medium {
		width: 16px;
		height: 16px;
	}
	.lcd-header-text {
		font-size: 10px;
	}

	/* Main Display */
	.lcd-display-area {
		background-color: #0f0f0f;
		border: 2px solid #2a2a2a;
		border-radius: 4px;
		padding: 16px;
		min-height: 140px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.lcd-center-text {
		text-align: center;
	}
	.lcd-placeholder-dash {
		color: #a0ff00;
		font-size: 48px;
		font-weight: bold;
		margin-bottom: 8px;
	}
	.lcd-placeholder-text {
		color: #a0ff00;
		font-size: 18px;
	}
	.lcd-pedal-name {
		color: #a0ff00;
		font-size: 24px;
		font-weight: bold;
		text-align: center;
		width: 100%;
	}

	/* --- Bottom Section (FX Chain) Styles --- */
	.bottom-section {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-top: 16px;
		border-top: 2px solid #1a1a1a;
	}
	.in-out-label {
		color: #777;
		font-size: 12px;
		text-transform: uppercase;
	}
	.fx-chain {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 16px;
		padding: 0 16px;
	}
	.fx-block {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
	}
	.fx-led {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background-color: #4a9eff;
		box-shadow: 0 0 8px rgba(74, 158, 255, 0.5); /* Blue glow effect */
	}
	.fx-label {
		color: #999;
		font-size: 10px;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	/* --- Functional Controls (Below Pedal) --- */
	.functional-controls {
		margin-top: 32px;
		padding: 24px;
		background-color: #1a1a1a;
		border-radius: 8px;
		border: 2px solid #2a2a2a;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
	.form-group {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.form-label {
		color: #999;
		font-size: 14px;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	/* Custom styling for standard HTML select/input to match the theme */
	.form-select,
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
	.form-select:focus,
	.form-input:focus {
		outline: none;
		border-color: #a0ff00;
		box-shadow: 0 0 0 1px #a0ff00;
	}

	.summary-box {
		margin-top: 16px;
		padding: 16px;
		background-color: #0a0a0a;
		border: 2px solid #3a3a3a;
		border-radius: 4px;
		font-family: monospace;
		color: #a0ff00;
		font-size: 14px;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.summary-label {
		color: #777;
		margin-right: 8px;
	}

	.submit-button {
		background-color: #a0ff00;
		color: #1a1a1a;
		font-weight: bold;
		text-transform: uppercase;
		padding: 12px 20px;
		border-radius: 4px;
		border: none;
		cursor: pointer;
		transition: background-color 0.15s;
		margin-top: 12px;
	}

	.submit-button:hover:not(:disabled) {
		background-color: #76c000;
	}

	.submit-button:disabled {
		background-color: #555;
		color: #aaa;
		cursor: not-allowed;
	}
</style>
