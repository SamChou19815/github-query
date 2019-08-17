import React, { ReactElement } from 'react';
import Chip from '@material-ui/core/Chip';
import styles from './ChippedText.module.css';

export default ({ text }: { readonly text: string }): ReactElement => (
  <Chip label={text} className={styles.Chip} />
);
