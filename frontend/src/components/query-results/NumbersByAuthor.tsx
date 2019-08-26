import React, { ReactElement } from 'react';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

interface HasAuthor {
  readonly author: string | null;
}

type NumbersByAuthorProps = { readonly title: string; readonly items: readonly HasAuthor[] };

type Entry = { readonly author: string; readonly count: number };

const getSortedAuthorCountMapping = (items: readonly HasAuthor[]): readonly Entry[] => {
  const authorCountMap = new Map<string, number>();
  items.forEach(({ author }) => {
    if (author === null) {
      return;
    }
    authorCountMap.set(author, (authorCountMap.get(author) || 0) + 1);
  });
  return (
    Array.from(authorCountMap.entries())
      .map(([author, count]) => ({ author, count }))
      // sorted in decreasing order
      .sort((entry1, entry2) => entry2.count - entry1.count)
  );
};

export default ({ title, items }: NumbersByAuthorProps): ReactElement | null => {
  const authorCountMapping = getSortedAuthorCountMapping(items);
  if (authorCountMapping.length === 0) {
    return null;
  }
  return (
    <>
      <Divider />
      <CardContent>
        <h4>{`${title} by authors:`}</h4>
        <List dense>
          {authorCountMapping.map(({ author, count }) => (
            <ListItem
              key={author}
              component="a"
              href={`https://github.com/${author}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ListItemText primary={author} />
              <ListItemSecondaryAction>{count}</ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </>
  );
};
