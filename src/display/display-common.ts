import { SingleAnalysisReport } from '../analysis/analysis-common';

export type Display = (allAnalysisResult: readonly SingleAnalysisReport[]) => void;
