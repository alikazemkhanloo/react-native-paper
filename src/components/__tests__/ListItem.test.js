import * as React from 'react';
import renderer from 'react-test-renderer';
import { Text } from 'react-native';
import ListItem from '../List/ListItem.tsx';
import ListIcon from '../List/ListIcon.tsx';

it('renders list item with title and description', () => {
  const tree = renderer
    .create(
      <ListItem title="First Item" description="Description for first item" />
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders list item with left item', () => {
  const tree = renderer
    .create(
      <ListItem
        title="First Item"
        left={props => <ListIcon {...props} icon="folder" />}
      />
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders list item with right item', () => {
  const tree = renderer
    .create(<ListItem title="First Item" right={() => <Text>GG</Text>} />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders list item with left and right items', () => {
  const tree = renderer
    .create(
      <ListItem
        title="First Item"
        description="Item description"
        left={() => <Text>GG</Text>}
        right={props => <ListIcon {...props} icon="folder" />}
      />
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders list item with custom title and description styles', () => {
  const tree = renderer
    .create(
      <ListItem
        title="First Item"
        description="Item description"
        titleStyle={{ fontSize: 20 }}
        descriptionStyle={{ color: 'red' }}
      />
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});
