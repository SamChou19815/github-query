import { Repository } from '../core/processed-types';

export interface AnalysisStatistics {
  readonly [name: string]: number;
}

export interface AnalysisResult {
  readonly statisticsValueType: 'count' | 'average';
  readonly statistics: AnalysisStatistics;
}

export type SingleAnalysisReport = {
  readonly analysisName: string;
  readonly analysisStatistics: AnalysisStatistics;
  readonly analysisStatisticsValueType: 'count' | 'average';
};

export type LocalAnalysis = (
  repository: Repository<Date>,
  afterDate: Date | null
) => readonly [AnalysisStatistics, AnalysisStatistics];

export type GlobalAnalysis = (
  repositories: readonly Repository<Date>[],
  afterDate: Date | null
) => AnalysisResult;

// eslint-disable-next-line import/prefer-default-export
export const roundToDaysWith2Digits = (timeIntervalInMilliseconds: number): number => {
  const average = Math.round((timeIntervalInMilliseconds / 1000 / 3600 / 24) * 100) / 100;
  return isNaN(average) ? 0 : average;
};
