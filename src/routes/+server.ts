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
Generate the effects chain preset. The response MUST be a JSON string wrapped in a markdown code block (\`\`\`json...\`\`\`). The JSON object MUST have a single key, "preset", that contains an array of effects. Each effect in the array MUST include a "setting" object with realistic and appropriate key/value pairs.
Example output structure:
\`\`\`json
{
  "preset": [
    {
      "fx-block-name": "FX",
      "effect-name": "Overdrive",
      "on/off": "on",
      "setting": {
        "Drive": 7.0,
        "Tone": 5.0,
        "Level": 6.5
      }
    }
  ]
}
\`\`\`
Match the fx-block-name to the "effect-chain" order and choose a single "effect-name" from the available "modules" for that block.
`;

	try {
		const preset = await generatePreset(prompt);
		return new Response(JSON.stringify(preset.preset), {
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	} catch {
		return new Response(JSON.stringify({ error: 'Failed to generate preset' }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
};
