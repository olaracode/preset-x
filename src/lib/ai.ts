import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '$env/static/private';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
	model: 'gemini-2.5-flash',
	generationConfig: {
		responseMimeType: 'application/json'
	}
});

export async function generatePreset(prompt: string) {
	console.log(prompt);
	try {
		const result = await model.generateContent(prompt);
		const response = await result.response;
		const text = response.text();
		return JSON.parse(text);
	} catch (error) {
		console.error('Error generating preset:', error);
		throw new Error('Failed to generate preset');
	}
}
