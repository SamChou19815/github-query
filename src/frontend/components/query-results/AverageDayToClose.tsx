import React, { ReactElement } from 'react';
import BadgedText from './BadgedText';

interface ClosableObject {
  readonly createdAt: Date;
  readonly closedAt: Date | null;
}

type AverageDayToCloseProps = {
  readonly totalCount: number;
  readonly items: readonly ClosableObject[];
};

export default ({ items, totalCount }: AverageDayToCloseProps): ReactElement => {
  let totalOpenedTime = 0;
  items.forEach(({ createdAt, closedAt }) => {
    if (closedAt !== null) {
      totalOpenedTime += closedAt.getTime() - createdAt.getTime();
    }
  });
  const averageDaysToClose =
    totalCount === 0 ? 0 : parseFloat((totalOpenedTime / 1000 / 3600 / 24 / totalCount).toFixed(2));
  return <BadgedText title="Average Days to Close" count={averageDaysToClose} />;
};
