'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/ai-suggest-activity.ts';
import '@/ai/flows/student-chatbot.ts';
import '@/ai/flows/generate-linkedin-post.ts';
import '@/ai/flows/verify-certificate.ts';
