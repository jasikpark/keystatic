import { AriaToastRegionProps } from '@react-aria/toast';
import {
  QueuedToast,
  ToastOptions as SpectrumToastOptions,
  ToastState,
} from '@react-stately/toast';
import { ReactNode } from 'react';

export type ToasterProps = AriaToastRegionProps & {};

export type ToastOptions = Omit<SpectrumToastOptions, 'priority'> & {
  /** A label for the action button within the toast. */
  actionLabel?: ReactNode;
  /** Handler that is called when the action button is pressed. */
  onAction?: () => void;
  /** Whether the toast should automatically close when an action is performed. */
  shouldCloseOnAction?: boolean;
};

export type ToastValue = {
  children: ReactNode;
  tone: 'info' | 'critical' | 'neutral' | 'positive';
  actionLabel?: ReactNode;
  onAction?: () => void;
  shouldCloseOnAction?: boolean;
};

export type ToastProps = {
  toast: QueuedToast<ToastValue>;
  state: ToastState<ToastValue>;
};

export type ToastContainerProps = AriaToastRegionProps & {
  children: ReactNode;
  state: ToastState<unknown>;
};
