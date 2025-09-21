'use server';

/**
 * @fileOverview An AI agent that suggests relevant activities to students based on their profile and academic interests.
 *
 * - suggestActivity - A function that handles the activity suggestion process.
 * - SuggestActivityInput - The input type for the suggestActivity function.
 * - SuggestActivityOutput - The return type for the suggestActivity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestActivityInputSchema = z.object({
  studentProfile: z
    .string()
    .describe('A detailed profile of the student, including their academic interests, skills, and past experiences.'),
  numberOfSuggestions: z
    .number()
    .default(3)
    .describe('The number of activity suggestions to generate.'),
});
export type SuggestActivityInput = z.infer<typeof SuggestActivityInputSchema>;

const SuggestActivityOutputSchema = z.object({
  suggestions: z.array(
    z.object({
      title: z.string().describe('The title of the suggested activity.'),
      category: z.string().describe('The category of the suggested activity.'),
      description: z.string().describe('A brief description of the activity and its benefits.'),
    })
  ).describe('A list of activity suggestions tailored to the student profile.'),
});
export type SuggestActivityOutput = z.infer<typeof SuggestActivityOutputSchema>;

export async function suggestActivity(input: SuggestActivityInput): Promise<SuggestActivityOutput> {
  return suggestActivityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestActivityPrompt',
  input: {schema: SuggestActivityInputSchema},
  output: {schema: SuggestActivityOutputSchema},
  prompt: `You are an AI assistant specialized in suggesting extracurricular activities to college students based on their profiles.

  Given the following student profile:
  {{studentProfile}}

  Suggest {{numberOfSuggestions}} relevant activities that would enhance their portfolio and broaden their experiences. Provide a title, category, and brief description for each suggestion.

  Format your response as a JSON object that matches the following schema:
  ${JSON.stringify(SuggestActivityOutputSchema.shape, null, 2)}`,
});

const suggestActivityFlow = ai.defineFlow(
  {
    name: 'suggestActivityFlow',
    inputSchema: SuggestActivityInputSchema,
    outputSchema: SuggestActivityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
