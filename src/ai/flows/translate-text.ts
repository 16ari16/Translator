'use server';

/**
 * @fileOverview Text translation flow using AI.
 *
 * - translateText - A function that translates text from one language to another.
 * - TranslateTextInput - The input type for the translateText function.
 * - TranslateTextOutput - The return type for the translateText function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const TranslateTextInputSchema = z.object({
  text: z.string().describe('The text to be translated.'),
  sourceLanguage: z.string().describe('The language of the input text.'),
  targetLanguage: z.string().describe('The language to translate the text to.'),
});
export type TranslateTextInput = z.infer<typeof TranslateTextInputSchema>;

const TranslateTextOutputSchema = z.object({
  translatedText: z.string().describe('The translated text.'),
});
export type TranslateTextOutput = z.infer<typeof TranslateTextOutputSchema>;

export async function translateText(input: TranslateTextInput): Promise<TranslateTextOutput> {
  return translateTextFlow(input);
}

const translateTextPrompt = ai.definePrompt({
  name: 'translateTextPrompt',
  input: {
    schema: z.object({
      text: z.string().describe('The text to be translated.'),
      sourceLanguage: z.string().describe('The language of the input text.'),
      targetLanguage: z.string().describe('The language to translate the text to.'),
    }),
  },
  output: {
    schema: z.object({
      translatedText: z.string().describe('The translated text.'),
    }),
  },
  prompt: `Translate the following text from {{sourceLanguage}} to {{targetLanguage}}:\n\n{{text}}`,
});

const translateTextFlow = ai.defineFlow<
  typeof TranslateTextInputSchema,
  typeof TranslateTextOutputSchema
>(
  {
    name: 'translateTextFlow',
    inputSchema: TranslateTextInputSchema,
    outputSchema: TranslateTextOutputSchema,
  },
  async input => {
    const {output} = await translateTextPrompt(input);
    return output!;
  }
);
