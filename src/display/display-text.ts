#!/usr/bin/env node

/* eslint-disable no-console */
import chalk from 'chalk';

import { Display } from './display-common';

const displayWithText: Display = (allAnalysisResult) =>
  allAnalysisResult.forEach(({ analysisName, analysisResult }) => {
    console.group(chalk.green(analysisName));
    Object.entries(analysisResult).forEach(([name, value]) => {
      console.log(`${chalk.cyan(name)}: ${value}`);
    });
    console.groupEnd();
  });

export default displayWithText;
