import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '$env/static/private';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
	model: 'gemini-2.5-flash'
});

export async function generatePreset(prompt: string) {
	console.log(prompt);
	try {
		const result = await model.generateContent(prompt);
		const response = await result.response;
		const text = response.text();

		// Extract JSON string from markdown code block
		const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
		if (jsonMatch && jsonMatch[1]) {
			return JSON.parse(jsonMatch[1]);
		} else {
			throw new Error('Could not extract JSON from AI response');
		}
	} catch (error) {
		console.error('Error generating preset:', error);
		throw new Error('Failed to generate preset');
	}
}

