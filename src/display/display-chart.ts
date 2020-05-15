/* eslint-disable new-cap */
import blessed from 'blessed';
import blessedContributions from 'blessed-contrib';

import { Display } from './display-common';

const MAX_COLUMNS = 11;

const displayWithCharts: Display = (allAnalysisReports) => {
  const filteredAnalysis = allAnalysisReports
    .map(({ analysisName, analysisResult }) => {
      const noneZeroSortedData = Object.entries(analysisResult)
        .filter(([, value]) => value > 0)
        .sort(([, value1], [, value2]) => value2 - value1);
      const titles = noneZeroSortedData
        .slice(0, MAX_COLUMNS)
        .map(([name]) => (name.includes('/') ? name.substring(name.indexOf('/') + 1) : name))
        .map((name) => (name.length > 15 ? `${name.substring(0, 12)}...` : name));
      const values = noneZeroSortedData.slice(0, MAX_COLUMNS).map(([, value]) => value);
      return { analysisName, titles, values };
    })
    .filter(({ titles }) => titles.length > 0);
  const pages = filteredAnalysis.map(
    ({ analysisName, titles, values }) => (screen: blessed.Widgets.Screen) => {
      const bar = blessedContributions.bar({
        label: analysisName,
        barWidth: 4,
        barSpacing: 20,
        maxHeight: 9,
        data: { titles, data: values },
      });
      screen.append(bar);
    }
  );
  const screen = blessed.screen();
  screen.key(['escape', 'q', 'C-c'], () => process.exit(0));
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const carousel = new blessedContributions.carousel(pages, {
    screen,
    interval: 0, // how often to switch views (set 0 to never swicth automatically)
    controlKeys: true, // should right and left keyboard arrows control view rotation
  });
  carousel.start();
};

export default displayWithCharts;
