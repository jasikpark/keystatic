'use client';
import { HTMLAttributes, ReactNode, Fragment, useCallback } from 'react';

import { ChevronEndIcon } from '@voussoir/icon';
import { Box, Flex } from '@voussoir/layout';
import { LinkComponentProps } from '@voussoir/link';
import { css, tokenSchema } from '@voussoir/style';
import { Text } from '@voussoir/typography';

import { HeadingEntry } from '../../utils/generate-toc';
import { ASIDE_WIDTH, HEADER_HEIGHT, SIDEBAR_WIDTH } from '../constants';
import { TocContextProvider, useTocContext } from './toc-context';

const MAIN_ID = 'docs-main';

export function DocsContent({
  children,
  toc,
}: {
  children: ReactNode;
  toc?: HeadingEntry[];
}): JSX.Element {
  const includeNavigation = toc !== undefined;
  // TODO: find a better solution for inline styles related to heading offsets
  return (
    <TocContextProvider value={toc || []}>
      <Flex
        elementType="main"
        flex
        minWidth={0}
        height="100%"
        width="100%"
        paddingStart={{ tablet: SIDEBAR_WIDTH }}
        paddingEnd={{ desktop: includeNavigation ? ASIDE_WIDTH : undefined }}
      >
        <Content id={MAIN_ID}>{children}</Content>

        {includeNavigation && <Aside />}
      </Flex>
    </TocContextProvider>
  );
}

type ElementProps = HTMLAttributes<HTMLDivElement>;

const Content = (props: ElementProps) => {
  return (
    <Box
      flex
      marginX="auto"
      maxWidth={840}
      minWidth={0}
      marginTop={{ mobile: HEADER_HEIGHT, tablet: 0 }}
      padding={{ mobile: 'large', tablet: 'xlarge' }}
    >
      {/* PROSE */}
      <Flex
        direction="column"
        gap="xlarge"
        // elementType="article"
        paddingBottom="xxlarge"
        {...props}
      />

      <Box borderTop="neutral" elementType="footer" paddingY="xxlarge">
        <Text size="small" color="neutralSecondary">
          &copy; {new Date().getFullYear()} @jossmac
        </Text>
      </Box>
    </Box>
  );
};

const Aside = () => {
  return (
    <Box
      elementType="aside"
      isHidden={{ below: 'desktop' }}
      // backgroundColor="inset"
      height="100%"
      insetEnd={0}
      overflow="hidden auto"
      padding="xlarge"
      position="fixed"
      width={ASIDE_WIDTH}
    >
      <TableOfContents />
    </Box>
  );
};

const TableOfContents = () => {
  const headingId = 'spark-toc-heading';

  return (
    <Flex direction="column" gap="large">
      <Text
        elementType="h4"
        id={headingId}
        color="neutralEmphasis"
        marginStart="medium"
        weight="bold"
      >
        On this page
      </Text>
      <nav aria-labelledby={headingId}>
        <HeadingList />
      </nav>
    </Flex>
  );
};

const HeadingList = () => {
  const { headings } = useTocContext();

  const headingMap = useCallback((heading: HeadingEntry) => {
    return (
      <Fragment key={heading.id}>
        <HeadingItem
          id={heading.id}
          level={heading.level}
          href={`#${heading.id}`}
        >
          {heading.title}
        </HeadingItem>
        {heading.items.length ? heading.items.map(headingMap) : null}
      </Fragment>
    );
  }, []);

  //  TODO: implement observer to highlight current anchor
  return <Box elementType="ul">{headings.map(headingMap)}</Box>;
};

type HeadingItemProps = LinkComponentProps & Pick<HeadingEntry, 'id' | 'level'>;
const HeadingItem = ({
  // id,
  href,
  onClick,
  children,
  level,
}: HeadingItemProps) => {
  const isSubItem = level > 2;
  // const isActive = useIsActive(id);

  return (
    <Box elementType="li" marginTop={isSubItem ? undefined : 'regular'}>
      <Flex
        elementType="a"
        href={href}
        onClick={onClick}
        // styles
        alignItems="center"
        borderRadius="small"
        gap="small"
        height="regular"
        paddingX="medium"
        position="relative"
        UNSAFE_className={css({
          outline: 0,

          '&:hover': {
            backgroundColor: tokenSchema.color.alias.backgroundHovered,
            color: tokenSchema.color.alias.foregroundHovered,
          },
          '&:active': {
            backgroundColor: tokenSchema.color.alias.backgroundPressed,
            color: tokenSchema.color.alias.foregroundPressed,
          },
          '&:focus-visible': {
            boxShadow: `0 0 0 ${tokenSchema.size.alias.focusRing} ${tokenSchema.color.alias.focusRing}`,
          },
        })}
      >
        {isSubItem && <ChevronEndIcon size="small" />}
        <Text
          trim={false}
          color="inherit"
          size={isSubItem ? 'small' : undefined}
          weight={!isSubItem ? 'medium' : undefined}
        >
          {children}
        </Text>
      </Flex>
    </Box>
  );
};
