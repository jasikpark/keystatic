import {
  createContext,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  useContext,
} from 'react';

import { alertCircleIcon } from '@voussoir/icon/icons/alertCircleIcon';
import { Icon } from '@voussoir/icon';
import { Box, BoxProps, Flex } from '@voussoir/layout';
import { VoussoirTheme, css, transition } from '@voussoir/style';
import { Heading, Text } from '@voussoir/typography';

import { Config } from '../../config';
import {
  GitHubAppShellProvider,
  AppShellErrorContext,
  LocalAppShellProvider,
} from './data';
import { SidebarProvider, Sidebar, SIDEBAR_WIDTH } from './sidebar';
import { isGitHubConfig, isLocalConfig } from '../utils';

const ConfigContext = createContext<Config | null>(null);
export function useConfig(): Config {
  const config = useContext(ConfigContext);
  if (!config) {
    throw new Error('ConfigContext.Provider not found');
  }
  return config;
}

export const AppShell = (props: {
  config: Config;
  children: ReactNode;
  currentBranch: string;
  basePath: string;
}) => {
  const inner = (
    <ConfigContext.Provider value={props.config}>
      <SidebarProvider>
        <Flex
          direction={{ mobile: 'column', tablet: 'row' }}
          width="100vw"
          minHeight="100vh"
        >
          <Sidebar hrefBase={props.basePath} config={props.config} />
          <AppShellErrorContext.Consumer>
            {error =>
              error &&
              !error?.graphQLErrors.some(
                err => (err?.originalError as any)?.type === 'NOT_FOUND'
              ) ? (
                <EmptyState
                  icon={alertCircleIcon}
                  title="Failed to load shell"
                  message={error.message}
                />
              ) : (
                props.children
              )
            }
          </AppShellErrorContext.Consumer>
        </Flex>
      </SidebarProvider>
    </ConfigContext.Provider>
  );
  if (isGitHubConfig(props.config) || props.config.storage.kind === 'cloud') {
    return (
      <GitHubAppShellProvider
        currentBranch={props.currentBranch}
        config={props.config}
      >
        {inner}
      </GitHubAppShellProvider>
    );
  }
  if (isLocalConfig(props.config)) {
    return (
      <LocalAppShellProvider config={props.config}>
        {inner}
      </LocalAppShellProvider>
    );
  }
  return null;
};

// Styled components
// -----------------------------------------------------------------------------

type EmptyStateProps =
  | { children: ReactNode }
  | {
      title?: ReactNode;
      icon?: ReactElement;
      message?: ReactNode;
      actions?: ReactNode;
    };
export function EmptyState(props: EmptyStateProps) {
  return (
    <Flex
      alignItems="center"
      direction="column"
      gap="large"
      justifyContent="center"
      minHeight="size.scale.3000"
    >
      {'children' in props ? (
        props.children
      ) : (
        <>
          {props.icon && (
            <Icon src={props.icon} size="large" color="neutralEmphasis" />
          )}
          {props.title && <Heading size="medium">{props.title}</Heading>}
          {props.message && <Text align="center">{props.message}</Text>}
          {props.actions}
        </>
      )}
    </Flex>
  );
}

// Composite components
// -----------------------------------------------------------------------------

export const AppShellBody = ({ children }: PropsWithChildren) => {
  return (
    <Box paddingY="xlarge">
      <AppShellContainer>{children}</AppShellContainer>
    </Box>
  );
};

type AppShellContextValue = {
  containerWidth: keyof VoussoirTheme['size']['container'];
};
const AppShellContext = createContext<AppShellContextValue>({
  containerWidth: 'medium',
});
export const AppShellRoot = ({
  children,
  containerWidth = 'medium',
}: PropsWithChildren<Partial<AppShellContextValue>>) => {
  return (
    <AppShellContext.Provider value={{ containerWidth }}>
      <Box
        elementType="main"
        flex
        minHeight="100vh"
        minWidth={0}
        paddingStart={{ tablet: SIDEBAR_WIDTH }}
        UNSAFE_className={css({
          '&::before': {
            backgroundColor: '#0006',
            content: '""',
            inset: 0,
            opacity: 0,
            pointerEvents: 'none',
            position: 'fixed',
            transition: transition('opacity'),
            zIndex: 99,
          },
          'nav[data-visible=true] ~ &::before': {
            opacity: 1,
          },
        })}
      >
        {children}
      </Box>
    </AppShellContext.Provider>
  );
};

export const AppShellContainer = (props: BoxProps) => {
  const { containerWidth } = useContext(AppShellContext);
  return (
    <Box
      maxWidth={`size.container.${containerWidth}`}
      marginX="auto"
      paddingX={{ mobile: 'regular', tablet: 'xlarge' }}
      {...props}
    />
  );
};
