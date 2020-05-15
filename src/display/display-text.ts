#!/usr/bin/env node

/* eslint-disable no-console */
import chalk from 'chalk';

import { Display } from './display-common';

const displayWithText: Display = (allAnalysisResult) =>
  allAnalysisResult.forEach(({ analysisName, analysisStatistics, analysisStatisticsValueType }) => {
    console.group(chalk.green(analysisName));
    if (analysisStatisticsValueType === 'count') {
      const sum = Object.values(analysisStatistics).reduce(
        (accumulator, value) => accumulator + value,
        0
      );
      console.log(`${chalk.cyan('Total')}: ${sum}`);
    }
    Object.entries(analysisStatistics).forEach(([name, value]) => {
      console.log(`${chalk.cyan(name)}: ${value}`);
    });
    console.groupEnd();
  });

export default displayWithText;
