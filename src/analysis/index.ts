/* eslint-disable no-console */
import chalk from 'chalk';

import { Repository } from '../core/processed-types';
import { LocalAnalysis, GlobalAnalysis } from './analysis-common';
import IssueHealthAnalysis from './analysis-issue-health';
import PullRequestHealthAnalysis from './analysis-pr-health';
import PullRequestMemberStatisticsAnalysis from './analysis-pr-member-statistics';

const localAnalysis: { readonly [analysisName: string]: LocalAnalysis } = {
  IssueHealthAnalysis,
  PullRequestHealthAnalysis,
};

const globalAnalysis: { readonly [analysisName: string]: GlobalAnalysis } = {
  PullRequestMemberStatisticsAnalysis,
};

export const analyzeLocal = (repository: Repository<Date>, afterDate: Date | null): void => {
  Object.entries(localAnalysis).forEach(([analysisName, analysisFunction]) => {
    console.group(chalk.cyan(analysisName));
    const result = analysisFunction(repository, afterDate);
    Object.entries(result).forEach(([metricName, metricResult]) => {
      console.log(`${metricName}: ${metricResult}`);
    });
    console.groupEnd();
  });
};

export const analyzeGlobal = (
  repositories: readonly Repository<Date>[],
  afterDate: Date | null
): void => {
  Object.entries(globalAnalysis).forEach(([analysisName, analysisFunction]) => {
    console.group(chalk.green(analysisName));
    const result = analysisFunction(repositories, afterDate);
    Object.entries(result).forEach(([metricName, metricResult]) => {
      console.log(`${chalk.cyan(metricName)}: ${metricResult}`);
    });
    console.groupEnd();
  });
};
