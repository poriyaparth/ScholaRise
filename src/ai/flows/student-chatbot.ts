
'use server';

/**
 * @fileOverview A conversational AI chatbot for Ascend.
 *
 * - studentChatbot - A function that handles the chatbot conversation.
 * - StudentChatbotInput - The input type for the studentChatbot function.
 * - StudentChatbotOutput - The return type for the studentChatbot function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const StudentChatbotInputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).describe('The conversation history.'),
  query: z.string().describe('The user\'s latest query.'),
});
export type StudentChatbotInput = z.infer<typeof StudentChatbotInputSchema>;

const StudentChatbotOutputSchema = z.object({
  response: z.string().describe('The chatbot\'s response.'),
});
export type StudentChatbotOutput = z.infer<typeof StudentChatbotOutputSchema>;


export async function studentChatbot(input: StudentChatbotInput): Promise<StudentChatbotOutput> {
  return studentChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'studentChatbotPrompt',
  input: { schema: StudentChatbotInputSchema },
  output: { schema: StudentChatbotOutputSchema },
  prompt: `You are a friendly and helpful AI assistant for the "Ascend" application. Your goal is to answer student questions about the platform.

  Here is some information about the application:
  - Students can log their extracurricular activities (internships, workshops, etc.).
  - Activities are submitted for verification by an administrator.
  - Approved activities appear in the student's "My Portfolio".
  - The portfolio is a shareable, digital resume of all verified achievements.
  - Students can see their rank on a leaderboard based on approved activities.
  - The "My Activities" page shows a log of all submissions and their status (Approved, Pending, Rejected).
  - Students can edit and resubmit activities that were rejected.
  - The "AI Suggestions" feature can recommend new activities.

  Use the conversation history and the user's query to provide a concise and helpful response. Keep your answers short and to the point.

  Conversation History:
  {{#each history}}
  - {{role}}: {{content}}
  {{/each}}

  User Query:
  {{{query}}}
  `,
});

const studentChatbotFlow = ai.defineFlow(
  {
    name: 'studentChatbotFlow',
    inputSchema: StudentChatbotInputSchema,
    outputSchema: StudentChatbotOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return { response: output!.response };
  }
);
