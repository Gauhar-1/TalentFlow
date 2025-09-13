import { setupWorker } from 'msw/browser';
import { jobsHandlers } from './handlers/jobs';

export const worker = setupWorker(...jobsHandlers);