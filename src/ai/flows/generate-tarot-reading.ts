// 'use server'
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a tarot card reading based on the selected cards and spread.
 *
 * - generateTarotReading - A function that takes the selected cards and spread as input and returns a tarot card reading.
 * - GenerateTarotReadingInput - The input type for the generateTarotReading function.
 * - GenerateTarotReadingOutput - The return type for the generateTarotReading function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTarotReadingInputSchema = z.object({
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
export type GenerateTarotReadingInput = z.infer<typeof GenerateTarotReadingInputSchema>;

const GenerateTarotReadingOutputSchema = z.object({
  reading: z.string().describe('The generated tarot card reading based on the selected cards and spread.'),
});
export type GenerateTarotReadingOutput = z.infer<typeof GenerateTarotReadingOutputSchema>;

export async function generateTarotReading(input: GenerateTarotReadingInput): Promise<GenerateTarotReadingOutput> {
  return generateTarotReadingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTarotReadingPrompt',
  input: {schema: GenerateTarotReadingInputSchema},
  output: {schema: GenerateTarotReadingOutputSchema},
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

const generateTarotReadingFlow = ai.defineFlow(
  {
    name: 'generateTarotReadingFlow',
    inputSchema: GenerateTarotReadingInputSchema,
    outputSchema: GenerateTarotReadingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
