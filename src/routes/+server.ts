import type { RequestHandler } from './$types';
import { pedals } from '$lib/pedals';
import { generatePreset } from '$lib/ai';

export const POST: RequestHandler = async ({ request }) => {
	const { selectedPedal, toneDescription } = await request.json();

	const pedal = pedals.find((p) => p.name === selectedPedal);

	if (!pedal) {
		return new Response(JSON.stringify({ error: 'Pedal not found' }), {
			status: 404,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	const pedalConfig = await pedal.file;

	const prompt = `**Pedal Configuration (Use these constraints):**
${JSON.stringify(pedalConfig)}

**User Tone Request:**
${toneDescription}

**Task:**
Generate the effects chain preset. Match the fx-block-name to the "effect-chain" order and choose a single "effect-name" from the available "modules" for that block. Provide realistic and appropriate "setting" key/value pairs (e.g., Level: 5.5, Gain: 8.0, Tone: 4.5).
`;

	try {
		const preset = await generatePreset(prompt);
		return new Response(JSON.stringify(preset), {
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: 'Failed to generate preset' }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
};
