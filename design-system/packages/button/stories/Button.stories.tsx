import { action, storiesOf } from '@voussoir/storybook';

import { plusCircleIcon } from '@voussoir/icon/icons/plusCircleIcon';
import { chevronRightIcon } from '@voussoir/icon/icons/chevronRightIcon';
import { Icon } from '@voussoir/icon';
import { Flex } from '@voussoir/layout';
import { Text } from '@voussoir/typography';

import { Button, ButtonProps } from '../src';

storiesOf('Components/Button', module)
  .add('default', () => render())
  .add('icon', () => renderWithIcon())
  .add('tone', () => (
    <Flex direction="column" gap="regular">
      {render('Accent', { tone: 'accent' })}
      {render('Neutral', { tone: 'neutral' })}
      {render('Critical', { tone: 'critical' })}
      {renderWithIcon('Accent icon', { tone: 'accent' })}
      {renderWithIcon('Neutral icon', { tone: 'neutral' })}
      {renderWithIcon('Critical icon', { tone: 'critical' })}
    </Flex>
  ))
  .add('prominence: low', () => (
    <Flex direction="column" gap="regular">
      {render('Accent', { prominence: 'low', tone: 'accent' })}
      {render('Neutral', { prominence: 'low', tone: 'neutral' })}
      {render('Critical', { prominence: 'low', tone: 'critical' })}
      {renderWithIcon('Accent icon', { prominence: 'low', tone: 'accent' })}
      {renderWithIcon('Neutral icon', { prominence: 'low', tone: 'neutral' })}
      {renderWithIcon('Critical icon', { prominence: 'low', tone: 'critical' })}
    </Flex>
  ))
  .add('prominence: high', () => (
    <Flex direction="column" gap="regular">
      {render('Neutral', { prominence: 'high', tone: 'neutral' })}
      {render('Accent', { prominence: 'high', tone: 'accent' })}
      {render('Critical', { prominence: 'high', tone: 'critical' })}
      {renderWithIcon('Neutral icon', { prominence: 'high', tone: 'neutral' })}
      {renderWithIcon('Accent icon', { prominence: 'high', tone: 'accent' })}
      {renderWithIcon('Critical icon', {
        prominence: 'high',
        tone: 'critical',
      })}
    </Flex>
  ))
  .add('static: light', () => (
    <Flex
      direction="column"
      gap="regular"
      backgroundColor="accentEmphasis"
      padding="large"
    >
      {render('High', { prominence: 'high', static: 'light' })}
      {render('Default', { prominence: 'default', static: 'light' })}
      {render('Low', { prominence: 'low', static: 'light' })}
      {renderWithIcon('High icon', { prominence: 'high', static: 'light' })}
      {renderWithIcon('Default icon', {
        prominence: 'default',
        static: 'light',
      })}
      {renderWithIcon('Low icon', { prominence: 'low', static: 'light' })}
    </Flex>
  ))
  .add('static: dark', () => (
    <Flex
      direction="column"
      gap="regular"
      backgroundColor="accent"
      padding="large"
    >
      {render('High', { prominence: 'high', static: 'dark' })}
      {render('Default', { prominence: 'default', static: 'dark' })}
      {render('Low', { prominence: 'low', static: 'dark' })}
      {renderWithIcon('High icon', { prominence: 'high', static: 'dark' })}
      {renderWithIcon('Default icon', {
        prominence: 'default',
        static: 'dark',
      })}
      {renderWithIcon('Low icon', { prominence: 'low', static: 'dark' })}
    </Flex>
  ))
  .add('anchor', () => (
    <Flex direction="column" gap="regular">
      <Flex gap="regular">
        <Button href="https://example.com">Anchor</Button>
        <Button isDisabled href="https://example.com">
          Anchor
        </Button>
      </Flex>
      <Flex gap="regular">
        <Button prominence="low" href="https://example.com">
          Anchor
        </Button>
        <Button prominence="low" isDisabled href="https://example.com">
          Anchor
        </Button>
      </Flex>
      <Flex gap="regular">
        <Button prominence="high" href="https://example.com">
          Anchor
        </Button>
        <Button prominence="high" isDisabled href="https://example.com">
          Anchor
        </Button>
      </Flex>
    </Flex>
  ));

function render(label = 'Default', props: ButtonProps = {}) {
  return (
    <Flex gap="regular">
      <Button
        onPress={action('press')}
        onPressStart={action('pressstart')}
        onPressEnd={action('pressend')}
        {...props}
      >
        {label}
      </Button>
      <Button
        onPress={action('press')}
        onPressStart={action('pressstart')}
        onPressEnd={action('pressend')}
        isDisabled
        {...props}
      >
        {label} (disabled)
      </Button>
    </Flex>
  );
}
function renderWithIcon(label = 'Default', props: ButtonProps = {}) {
  return (
    <Flex gap="regular">
      <Button
        onPress={action('press')}
        onPressStart={action('pressstart')}
        onPressEnd={action('pressend')}
        {...props}
      >
        <Icon src={plusCircleIcon} />
        <Text>{label}</Text>
      </Button>
      <Button
        onPress={action('press')}
        onPressStart={action('pressstart')}
        onPressEnd={action('pressend')}
        isDisabled
        {...props}
      >
        <Text>{label} (disabled)</Text>
        <Icon src={chevronRightIcon} />
      </Button>
    </Flex>
  );
}
