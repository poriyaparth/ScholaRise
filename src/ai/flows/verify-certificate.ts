'use server';

/**
 * @fileOverview An AI agent that verifies student-submitted certificates.
 *
 * - verifyCertificate - A function that handles the certificate verification process.
 * - VerifyCertificateInput - The input type for the verifyCertificate function.
 * - VerifyCertificateOutput - The return type for the verifyCertificate function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VerifyCertificateInputSchema = z.object({
  activityTitle: z.string().describe("The title of the activity submitted by the student."),
  studentName: z.string().describe("The name of the student who submitted the activity."),
  certificateDataUri: z
    .string()
    .describe(
      "A mock certificate image as a data URI. In a real scenario, this would be the uploaded file."
    ),
});
export type VerifyCertificateInput = z.infer<typeof VerifyCertificateInputSchema>;

const VerifyCertificateOutputSchema = z.object({
  isAuthentic: z.boolean().describe("Whether the AI believes the certificate is authentic."),
  confidenceScore: z.number().min(0).max(1).describe("The AI's confidence in its assessment, from 0.0 to 1.0."),
  discrepancies: z.array(z.string()).describe("A list of discrepancies found between the certificate and the submission data."),
  recommendation: z.enum(['Approve', 'Flag for Review']).describe("The AI's final recommendation for the admin."),
});
export type VerifyCertificateOutput = z.infer<typeof VerifyCertificateOutputSchema>;

export async function verifyCertificate(input: VerifyCertificateInput): Promise<VerifyCertificateOutput> {
  return verifyCertificateFlow(input);
}

const prompt = ai.definePrompt({
  name: 'verifyCertificatePrompt',
  input: {schema: VerifyCertificateInputSchema},
  output: {schema: VerifyCertificateOutputSchema},
  prompt: `You are an expert document verification agent for the Ascend platform. Your task is to analyze a certificate image and determine its authenticity.

  You will be given the student's name, the activity title they submitted, and an image of the certificate.

  Your instructions are:
  1.  **Analyze the Image:** Examine the certificate image for signs of authenticity. The mock image text will contain details like the recipient's name and the course/event title.
  2.  **Cross-Validate:** Compare the name on the certificate with the provided student name ({{studentName}}) and the title on the certificate with the submitted activity title ({{activityTitle}}).
  3.  **Identify Discrepancies:** Note any mismatches in names, titles, or any signs of tampering (though in this mock scenario, focus on text mismatches).
  4.  **Assess Confidence:** Provide a confidence score between 0.0 and 1.0 for your assessment. A high score (e.g., > 0.9) means you are very confident it is authentic. A low score indicates potential issues.
  5.  **Make a Recommendation:**
      - If the details match and everything looks good, recommend 'Approve'.
      - If there are any significant discrepancies or suspicious signs, recommend 'Flag for Review'.

  Student Name Provided: {{studentName}}
  Activity Title Provided: {{activityTitle}}
  Certificate Image: {{media url=certificateDataUri}}

  Provide your analysis in the required JSON format.
  `,
});

const verifyCertificateFlow = ai.defineFlow(
  {
    name: 'verifyCertificateFlow',
    inputSchema: VerifyCertificateInputSchema,
    outputSchema: VerifyCertificateOutputSchema,
  },
  async input => {
    // In a real-world scenario, you might have more complex logic here,
    // like checking against a database of known certificate issuers.
    const {output} = await prompt(input);
    return output!;
  }
);
