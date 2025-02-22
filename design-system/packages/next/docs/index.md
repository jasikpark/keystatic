---
title: Next.js
description: Utilities for integrating Voussoir with Next.js's `app` directory.
category: Introduction
---

> `@voussoir/next` only works with Next.js's `app` directory. It does not work
> with the `pages` directory.

## RootVoussoirProvider

The `RootVoussoirProvider` exported from `@voussoir/next` should be rendered as
the `html` element in your root `layout` file to make server rendering styles
work properly. If you need another `VoussoirProvider` in your tree, you should
use the normal `VoussoirProvider` exported from `@voussoir/core`.

## `mediaQueryOnlyColorSchemeScaleScript`

To make sure that the color scheme and scale is correct before the main
client-side JavaScript loads, you should render a script tag that updates the
class names in the head. A default `mediaQueryOnlyColorSchemeScaleScript` export
is provided for this. This only looks at media queries, if you allow the user to
change the color scheme or scale, you should write your own script instead.

## Example

```tsx
// app/layout.tsx
import {
  RootVoussoirProvider,
  mediaQueryOnlyColorSchemeScaleScript,
} from '@voussoir/next';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export default function Layout(props: { children: ReactNode }) {
  return (
    <RootVoussoirProvider fontClassName={inter.variable}>
      <head>{mediaQueryOnlyColorSchemeScaleScript}</head>
      <body>{props.children}</body>
    </RootVoussoirProvider>
  );
}
```
