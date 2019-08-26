import React, { ReactElement } from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Error from '@material-ui/icons/Error';
import styles from './card.module.css';

export default (): ReactElement => (
  <Card className={styles.InformationCard}>
    <CardHeader avatar={<Error />} title="Disclaimer" />
    <CardContent>
      <b>DO NOT</b>
      {" completely rely on this tools to decide engineers' performance!"}
    </CardContent>
    <CardContent>
      There are important aspects of performance that cannot be decided by this tool, including but
      not limited to code quality, implementation efficiency, architecture, etc.
    </CardContent>
    <CardContent>
      In addition, some collected metrics might be misleading. For example, this tools cannot
      distuiguish significant lines of code vs insignficant ones (moving things around). Relying on
      this tool will likely result in high skewed results since engineers will start to optimize
      themselves around some stupid numbers instead of actual code.
    </CardContent>
  </Card>
);
