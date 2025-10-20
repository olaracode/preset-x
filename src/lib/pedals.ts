import type { TargetPedalConfig } from './types';

export type Pedal = {
	name: string;
	file: Promise<{ default: TargetPedalConfig }>;
};

export const pedals: readonly Pedal[] = [
	{
		name: 'Mooer GE150 Pro',
		file: import('./mooer-ge150-max.json')
	}
];
