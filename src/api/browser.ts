import { setupWorker } from 'msw/browser';
import { jobsHandlers } from './handlers/jobs';
import { candidateHandlers } from './handlers/candidate';

export const worker = setupWorker(...jobsHandlers, ...candidateHandlers);