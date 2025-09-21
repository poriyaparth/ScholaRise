'use server';

/**
 * @fileOverview An AI agent that generates a professional LinkedIn post from a student's activity.
 *
 * - generateLinkedInPost - A function that handles the post generation process.
 * - GenerateLinkedInPostInput - The input type for the generateLinkedInPost function.
 * - GenerateLinkedInPostOutput - The return type for the generateLinkedInPost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLinkedInPostInputSchema = z.object({
  activityTitle: z.string().describe("The title of the student's activity."),
  activityCategory: z.string().describe("The category of the activity (e.g., Internship, Certification)."),
  activityDescription: z.string().describe("A description of what the student did in the activity."),
  studentName: z.string().describe("The name of the student."),
});
export type GenerateLinkedInPostInput = z.infer<typeof GenerateLinkedInPostInputSchema>;

const GenerateLinkedInPostOutputSchema = z.object({
  postText: z
    .string()
    .describe('The generated LinkedIn post, including a professional caption and relevant hashtags.'),
});
export type GenerateLinkedInPostOutput = z.infer<typeof GenerateLinkedInPostOutputSchema>;

export async function generateLinkedInPost(input: GenerateLinkedInPostInput): Promise<GenerateLinkedInPostOutput> {
  return generateLinkedInPostFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLinkedInPostPrompt',
  input: {schema: GenerateLinkedInPostInputSchema},
  output: {schema: GenerateLinkedInPostOutputSchema},
  prompt: `You are an AI assistant that helps students create professional LinkedIn posts about their achievements.

  Given the following activity details for a student named {{studentName}}:
  - Title: "{{activityTitle}}"
  - Category: "{{activityCategory}}"
  - Description: "{{activityDescription}}"

  Generate a concise, enthusiastic, and professional LinkedIn post. The post should:
  1. Announce the achievement clearly.
  2. Briefly mention what the student learned or accomplished.
  3. Include 3 to 5 relevant and popular hashtags (e.g., #StudentSuccess, #CareerDevelopment, #{{activityCategory.replace(/\\s+/g, '')}}, etc.).

  Format the response as a JSON object with a single key: "postText".`,
});

const generateLinkedInPostFlow = ai.defineFlow(
  {
    name: 'generateLinkedInPostFlow',
    inputSchema: GenerateLinkedInPostInputSchema,
    outputSchema: GenerateLinkedInPostOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
