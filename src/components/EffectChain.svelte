<script lang="ts">
	import type { GeneratedPreset } from '$lib/types';

	export let preset: GeneratedPreset = [];
</script>

<div class="effect-chain-container">
	<h2>Generated Preset</h2>
	<div class="chain">
		{#each preset as block (block['fx-block-name'])}
			<div class="effect-block">
				<div class="block-header">
					<span class="block-name">{block['fx-block-name']}</span>
					<span class="effect-name">{block['effect-name']}</span>
					<span class={`status ${block['on/off']}`}>{block['on/off']}</span>
				</div>
				<div class="settings">
					{#each Object.entries(block.setting) as [key, value] (key)}
						<div class="setting">
							<span class="setting-key">{key}</span>
							<span class="setting-value">{value}</span>
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.effect-chain-container {
		margin-top: 2rem;
		padding: 1.5rem;
		background-color: #1a1a1a;
		border-radius: 8px;
		border: 2px solid #2a2a2a;
	}

	h2 {
		color: #a0ff00;
		text-align: center;
		margin-bottom: 1.5rem;
	}

	.chain {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.effect-block {
		background-color: #2a2a2a;
		border-radius: 6px;
		padding: 1rem;
		border: 1px solid #3a3a3a;
	}

	.block-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.block-name {
		font-weight: bold;
		color: #a0ff00;
		font-size: 1.2rem;
	}

	.effect-name {
		color: #ccc;
	}

	.status {
		padding: 0.2rem 0.5rem;
		border-radius: 4px;
		font-size: 0.8rem;
		text-transform: uppercase;
	}

	.status.on {
		background-color: #a0ff00;
		color: #1a1a1a;
	}

	.status.off {
		background-color: #555;
		color: #aaa;
	}

	.settings {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
		gap: 0.5rem;
	}

	.setting {
		display: flex;
		flex-direction: column;
	}

	.setting-key {
		color: #999;
		font-size: 0.8rem;
	}

	.setting-value {
		color: #fff;
		font-size: 1rem;
	}
</style>
