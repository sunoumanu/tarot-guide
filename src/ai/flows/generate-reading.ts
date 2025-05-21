// 'use server' 
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a tarot card reading based on the selected cards and spread.
 *
 * - generateReading - A function that takes the selected cards and spread as input and returns a tarot card reading.
 * - GenerateReadingInput - The input type for the generateReading function.
 * - GenerateReadingOutput - The return type for the generateReading function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateReadingInputSchema = z.object({
  spreadName: z.string().describe('The name of the tarot spread used (e.g., single card, three-card spread).'),
  cards: z
    .array(
      z.object({
        name: z.string().describe('The name of the card.'),
        meaning: z.string().describe('The general meaning of the card.'),
      })
    )
    .describe('An array of selected tarot cards with their names and meanings.'),
});
export type GenerateReadingInput = z.infer<typeof GenerateReadingInputSchema>;

const GenerateReadingOutputSchema = z.object({
  reading: z.string().describe('The generated tarot card reading based on the selected cards and spread.'),
});
export type GenerateReadingOutput = z.infer<typeof GenerateReadingOutputSchema>;

export async function generateReading(input: GenerateReadingInput): Promise<GenerateReadingOutput> {
  return generateReadingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReadingPrompt',
  input: {schema: GenerateReadingInputSchema},
  output: {schema: GenerateReadingOutputSchema},
  prompt: `You are an expert tarot card reader. You will provide a personalized reading based on the cards selected and their positions in the chosen spread.

Spread Name: {{{spreadName}}}

Cards:
{{#each cards}}
  - Name: {{this.name}}
    Meaning: {{this.meaning}}
{{/each}}

Generate a reading that combines the meanings of the cards in the context of the spread.  Consider the relationships between the cards and how they influence each other. Focus on providing guidance and insights to the querent.
`,
});

const generateReadingFlow = ai.defineFlow(
  {
    name: 'generateReadingFlow',
    inputSchema: GenerateReadingInputSchema,
    outputSchema: GenerateReadingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
