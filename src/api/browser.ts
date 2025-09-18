import { setupWorker } from 'msw/browser';
import { jobsHandlers } from './handlers/jobs';
import { candidateHandlers } from './handlers/candidate';
import { assessmentHandlers } from './handlers/assessment';

export const worker = setupWorker(...jobsHandlers, ...candidateHandlers, ...assessmentHandlers);