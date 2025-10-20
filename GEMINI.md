# GEMINI.md: API Interaction Strategy

This document outlines the standard operating procedure and best practices for interacting with the Gemini API to generate Multi-Effects Pedal Presets. This approach prioritizes **security**, **structured output**, and **prompt engineering** for high reliability.

## 1. Core Principles

| Principle       | Detail                                                                                       | Implementation Strategy (Gemini API)                                                                  |
| :-------------- | :------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------- |
| **Security**    | The API Key (`GEMINI_API_KEY`) must **never** be exposed to the client-side.                 | All calls must be handled by a **SvelteKit Server Endpoint** (`+server.ts`).                          |
| **Consistency** | The output must be a reliably parsed JSON object, strictly following the defined schema.     | Use **JSON Mode** (`response_mime_type: 'application/json'`) and define a strict **Response Schema**. |
| **Control**     | The model needs a specific persona and constraints to ensure high-quality, relevant results. | Use a **System Instruction** to set the role, goal, and rules for the model.                          |

## 2. API Request Structure

The call to the Gemini API (`generateContent` endpoint) will utilize the following key parameters, preferably with a model that supports JSON schema like `gemini-2.5-flash`.

### A. Configuration (`GenerateContentConfig`)

| Parameter            | Recommended Value             | Rationale                                                                                |
| :------------------- | :---------------------------- | :--------------------------------------------------------------------------------------- |
| `model`              | `gemini-2.5-flash`            | Balances speed, cost, and strong performance for structured data tasks.                  |
| `temperature`        | `0.3` (or lower, e.g., `0.1`) | Low temperature ensures deterministic, factual outputs, critical for technical settings. |
| `response_mime_type` | `'application/json'`          | Enforces a strict JSON output.                                                           |
| `response_schema`    | (See Section 4)               | Explicitly defines the required output JSON structure for maximum reliability.           |

### B. System Instruction (Crucial for Persona)

This instruction defines the AI's role and rules, steering the tone generation:

You are a Senior Effects Pedal Programming Engineer. Your sole purpose is to analyze a desired guitar tone and generate a precise, production-ready Multi-Effects Pedal preset.

RULES:

1.  **STRICT ADHERENCE:** You must only use the effects and modules provided in the Pedal Configuration JSON. Do not invent modules or use names not in the provided list.
2.  **OUTPUT ONLY JSON:** Your response MUST be valid JSON, strictly following the provided response schema. Do not include any explanatory text, markdown formatting (```json), or conversational language.
3.  **PRIORITIZE REALISM:** Settings should be chosen to accurately replicate the tonal goals (e.g., high gain for metal, low gain/clean for jazz).

## 3. Input Data (Prompt Construction)

The user prompt (contents) combines the user's request with the device constraints.

Input Data Schema (From JSON File)

```ts
// Define this structure in TypeScript on your server layer for type safety
interface TargetPedalConfig {
	Device: string;
	note: string; // Extra considerations for the AI
	'effect-chain': string; // Fx block order: "FX,DS,AMP,CAB,NR,EQ,MOD,DLY,RVB"
	modules: {
		[fxBlockName: string]: Array<{
			no: number;
			model_name: string; // The specific pedal/amp model name
			description: string;
		}>;
	};
}
```

**Full User Prompt Template**

The final prompt sent to the model will look like this (formatted as a single string):

```md
**Pedal Configuration (Use these constraints):**
[Serialized JSON string of TargetPedalConfig]

**User Tone Request:**
[User's input: "e.g., Jimi Hendrix's 'Voodoo Child' live tone"]

**Task:**
Generate the effects chain preset. Match the fx-block-name to the "effect-chain" order and choose a single "effect-name" from the available "modules" for that block. Provide realistic and appropriate "setting" key/value pairs (e.g., Level: 5.5, Gain: 8.0, Tone: 4.5).
```

## 4. Output Data Schema(Expected Preset Structure)

The AI's response must match this structure exactly. This schema should be provided to the API in the response_schema parameter to ensure strict compliance

```ts
// Define this type for runtime validation (e.g., using Zod) and frontend display
type GeneratedPreset = Array<FxBlock>;

interface FxBlock {
	'fx-block-name': string; // MUST be one of the names from TargetPedalConfig['effect-chain']
	'effect-name': string; // MUST be one of the available model_name values for the block
	setting: {
		[parameter: string]: string | number; // Key/Value pairs for the effect settings. Use strings for complex values if necessary (e.g., "Medium High").
	};
}
```

# 1. Architectural Best Practices

## A. The Backend-for-Frontend (BFF) Pattern

Do Not call the AI API (Gemini, Claude, etc.) directly from the SvelteKit frontend component.

**Principle**: Security and Decoupling.

**Recommendation**: Implement a Backend-for-Frontend (BFF) layer using SvelteKit's built-in Server Endpoints (via `+server.ts` files).

The frontend submits the user request (Target Pedal, tone description) to your SvelteKit API endpoint (e.g., `/api/generate-preset`).

This server endpoint handles the logic: loading the correct JSON, constructing the prompt, and making the secure, authenticated call to the external AI API.

**Reasoning**: This is the only way to safely store your confidential AI API Key (e.g., `GEMINI_API_KEY`) on the server where it's not exposed to the client's browser.

## B. Configuration Management

**Recommendation**: Use Environment Variables for all secrets and configuration.

**Public (Client/Server)**: Use `VITE_PUBLIC_...` (e.g., `VITE_PUBLIC_APP_VERSION`).

**Private (Server Only)**: Use standard environment variables (e.g., `GEMINI_API_KEY`, `SVELTEKIT_SECRET_KEY`).

**Best Practice**: Store and manage these using a tool like `dotenv` locally, and your cloud provider's secret management service (e.g., Google Secret Manager, AWS Secrets Manager) in production.

# 2. Frontend (SvelteKit/TypeScript) Best Practices

## A. Data Fetching and State Management

**Recommendation**: Use SvelteKit's `+page.server.ts` or `+server.ts` files for all data loading and mutations.

The Target Pedal JSON files should be loaded via a server-side API route to prevent exposing all device configurations to the client unnecessarily.

Use Svelte's built-in stores (`writable`, `readable`) only for client-side UI state (e.g., dropdown status, loading indicators). For global app configuration/data, rely on server loading patterns.

## B. Type Safety and Schemas

**Recommendation**: Enforce strict type checking for all data structures.

Define TypeScript `Interfaces` for the input JSON structure (`TargetPedalConfig`) and the final output structure (`GeneratedPreset`).

Use a validation library like `Zod` in your server endpoint (`+server.ts`) to:

1.  Validate the structure of the JSON file you load before passing it to the AI.
2.  Validate the structure of the JSON response from the AI before sending it back to the client. This prevents runtime crashes if the AI's output format is slightly off.

# 3. AI Prompt Engineering Best Practices (Critical)

The quality of the output depends entirely on the prompt.

## A. System Instructions and JSON Schema

**Recommendation**: Use the AI's System Instruction/Prompt to strictly enforce the output format.

Tell the AI exactly how the output must be formatted using a JSON schema you define (or use the AI's built-in JSON mode if available).

## B. Prompt Construction Flow

1.  **Define the Goal**: "You are a multi-effects pedal programming assistant. Your task is to generate a detailed effects preset based on the user's desired tone, strictly adhering to the available modules."
2.  **Provide the Constraints (The JSON Input)**:
    - List the available FX chain blocks (`effect-chain`).
    - List the available modules for each block (`modules`).
    - Include the `note` field for extra considerations.
3.  **Provide the User Input**: "The user wants the tone of: `[User's Description]`."
4.  **Define the Output Schema (Crucial)**: Explicitly show the required JSON output structure and constraints (e.g., all `effect-name` values must come from the provided `model_name` list).

**Example Prompt Snippet (Conceptual)**:

> "Using the provided pedal configuration, generate an effects chain to match the tone of 'Pink Floyd - Comfortably Numb' guitar solo.
>
> **Available Blocks**: `[List of blocks from JSON]`
> **Available Modules**: `[JSON string of the 'modules' object]`
>
> Your response must be a valid JSON array matching this schema: `[ { "fx-block-name": "...", "effect-name": "...", "setting": { "param_name": "value", ... } } ]`"

# 4. Error Handling and Resilience

**Recommendation**: Implement robust error handling.

- **Timeout/Retry Logic**: Use a pattern like Exponential Backoff when calling the external AI API to handle temporary network issues or rate limits.
- **AI Output Failure**: If the AI response is not valid JSON (despite your strict prompt), catch the parsing error and return a generic, friendly "Could not generate preset. Please try a different tone description." message to the user. Do not crash the application.
- **Loading Failure**: Ensure your SvelteKit server logic handles the case where the Target Pedal JSON file is not found.
