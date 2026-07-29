import rawReleasedExamQuestions from './releasedExamQuestions.json';
import type { Question } from '../types/exam';

export const releasedExamQuestions = rawReleasedExamQuestions as Question[];
