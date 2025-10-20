export interface TargetPedalConfig {
	Device: string;
	note: string;
	'effect-chain': string;
	modules: {
		[fxBlockName: string]: Array<{
			no: number;
			model_name: string;
			description: string;
		}>;
	};
}

export type GeneratedPreset = Array<FxBlock>;

export interface FxBlock {
	'fx-block-name': string;
	'effect-name': string;
	'on/off': 'on' | 'off';
	setting: {
		[parameter: string]: string | number;
	};
}
