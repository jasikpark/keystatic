---
title: Styling
description:
  This page describes how styling works in Voussoir, including how to customize
  spacing, sizing, and positioning, and how to create your own custom components
  using Voussoir styles.
category: Concepts
---

## Style props

Voussoir components support a limited set of styling options, including layout,
spacing, sizing, and positioning options.

### Patterns

While internal component styles such as padding, colors, borders and text styles
are not available to override, external styles like margins and layout
relationships can be set on most components.

```jsx {% live=true %}
<Flex direction="column" position="relative" padding="small">
  <Text alignSelf="center" width={120}>
    Style prop example
  </Text>
  <Badge position="absolute" insetTop="small" insetEnd="small">
    Placement
  </Badge>
</Flex>
```

The above example illustrates some common patterns:

- Layout primitives like [Flex](/package/layout/flex) accept common style props
  in addition to their own specific API.
- Prefer keys from the token schema e.g. `padding="small"` for spacing and
  dimension props. CSS unit values are allowed e.g. `width={120}` but should be
  used scarcely.
- Only [logical properties](#logical-properties) e.g. `insetEnd` (instead of
  `insetRight`) are supported for direction-relative props corresponding to the
  horizontal plane.

### Responsive props

Style props support responsive syntax to specify different values for the prop
depending on the breakpoint. Breakpoints are mobile-first and correspond to
common device resolutions.

```yaml
mobile: 0 # essentially the "base", influences all above
tablet: 768
desktop: 1280
wide: 1768 # target exceptionally wide viewports, which may undermine proximity relationships
```

In this example, the [Notice](/package/notice) has a default width of `50%`,
which is overridden to `size.container.xsmall` at the `desktop` breakpoint.
Resize your browser window to see this in action.

```jsx {% live=true %}
<Notice width={{ mobile: '50%', desktop: 'size.container.small' }}>
  Responsive example
</Notice>
```

Breakpoints are mobile first, which means style props apply at that breakpoint
and above. For example, the `"desktop"` breakpoint is applied at screen sizes
`1280px` and wider. The `"mobile"` value should be used to specify the layout at
the smallest possible screen size, and additional breakpoints may be added to
adapt the layout for larger devices.

### Conditional visibility

Conditionally toggle the visibility of components depending on the width of the
viewport. The `isHidden` style prop provides a convenient above/below syntax for
most cases.

```jsx {% live=true %}
<Grid gap="regular">
  <Placeholder isHidden={{ below: 'wide' }} height="large">
    1. Hidden below wide
  </Placeholder>
  <Placeholder isHidden={{ below: 'desktop' }} height="large">
    2. Hidden below desktop
  </Placeholder>
  <Placeholder isHidden={{ below: 'tablet' }} height="large">
    3. Hidden below tablet
  </Placeholder>
  <Placeholder isHidden={{ above: 'mobile' }} height="large">
    4. Hidden above mobile
  </Placeholder>
  <Placeholder isHidden={{ above: 'tablet' }} height="large">
    5. Hidden above tablet
  </Placeholder>
  <Placeholder isHidden={{ above: 'desktop' }} height="large">
    6. Hidden above desktop
  </Placeholder>
</Grid>
```

### Logical properties

[CSS Logical Properties and Values](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties)
is a module of CSS introducing logical properties and values that provide the
ability to control layout through logical, rather than physical, direction and
dimension mappings.

Voussoir's style props employ logical property syntax for **inline**, but not
block properties. For example `marginLeft` is instead `marginStart`, which means
everything _just&nbsp;works_ for RTL languages.

### Reference

Most components support the following style props.

#### Spacing

| Name           | Description                                                                                                                                                           |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `margin`       | The margin for all four sides of the element. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/margin).                                                     |
| `marginStart`  | The margin for the logical start side of the element, depending on layout direction. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-inline-start). |
| `marginEnd`    | The margin for the logical end side of an element, depending on layout direction. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-inline-end).      |
| `marginTop`    | The margin for the top side of the element. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-top).                                                   |
| `marginBottom` | The margin for the bottom side of the element. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-bottom).                                             |
| `marginX`      | The margin for both the left and right sides of the element. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/margin).                                      |
| `marginY`      | The margin for both the top and bottom sides of the element. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/margin).                                      |

#### Sizing

| Name        | Description                                                                                                |
| ----------- | ---------------------------------------------------------------------------------------------------------- |
| `width`     | The width of the element. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/width).               |
| `height`    | The height of the element. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/height).             |
| `minWidth`  | The minimum width of the element. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/min-width).   |
| `minHeight` | The minimum height of the element. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/min-height). |
| `maxWidth`  | The maximum width of the element. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/max-width).   |
| `maxHeight` | The maximum height of the element. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/max-height). |

#### Layout

| Name              | Description                                                                                                                                                                            |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `flex`            | When used in a flex layout, specifies how the element will grow or shrink to fit the space available. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/flex).                |
| `flexGrow`        | When used in a flex layout, specifies how the element will grow to fit the space available. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/flex-grow).                     |
| `flexShrink`      | When used in a flex layout, specifies how the element will shrink to fit the space available. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/flex-shrink).                 |
| `flexBasis`       | When used in a flex layout, specifies the initial main size of the element. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/flex-basis).                                    |
| `justifySelf`     | Specifies how the element is justified inside a flex or grid container. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/justify-self).                                      |
| `alignSelf`       | Overrides the `alignItems` property of a flex or grid container. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/align-self).                                               |
| `order`           | The layout order for the element within a flex or grid container. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/order).                                                   |
| `gridArea`        | When used in a grid layout, specifies the named grid area that the element should be placed in within the grid. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-area). |
| `gridColumn`      | When used in a grid layout, specifies the column the element should be placed in within the grid. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-column).             |
| `gridRow`         | When used in a grid layout, specifies the row the element should be placed in within the grid. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-row).                   |
| `gridColumnStart` | When used in a grid layout, specifies the starting column to span within the grid. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-column-start).                      |
| `gridColumnEnd`   | When used in a grid layout, specifies the ending column to span within the grid. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-column-end).                          |
| `gridRowStart`    | When used in a grid layout, specifies the starting row to span within the grid. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-row-start).                            |
| `gridRowEnd`      | When used in a grid layout, specifies the ending row to span within the grid. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-row-end).                                |

#### Positioning

| Name          | Description                                                                                                                                                |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `position`    | Specifies how the element is positioned. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/position).                                             |
| `inset`       | Shorthand that corresponds to the top, right, bottom, and/or left properties. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/inset).           |
| `insetTop`    | The top position for the element. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/top).                                                         |
| `insetBottom` | The bottom position for the element. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/bottom).                                                   |
| `insetStart`  | The logical start position for the element, depending on layout direction. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/inset-inline-start). |
| `insetEnd`    | The logical end position for the element, depending on layout direction. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/inset-inline-end).     |
| `zIndex`      | The stacking order for the element. See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/z-index).                                                   |

## Custom components

Sometimes, you may find yourself needing to build a component that doesn't exist
in the component library.

### The "box" primitive

A general purpose low-level primitive with no specific semantics that can be
used for styling. In addition to the above [style props](#style-props), the
`Box` accepts a suite of props for customising the appearance of an element.

```jsx {% live=true %}
<Box
  backgroundColor="accent"
  border="accent"
  borderRadius="small"
  padding="large"
>
  <Text>Box example</Text>
</Box>
```

The [layout](/package/layout/concepts#components) and
[typographic primitives](/package/typography/concepts#primitives), along with
many other components, are built with Boxes.

#### Element type

By default, `Box` renders a div element. You can customise this using the
`elementType` prop. Non-style props will be forwarded to the underlying element.

```jsx
<Box elementType="span" id="element-type-example">
  ...
</Box>
```

### Token schema

The `tokenSchema` object provides access to Voussoir’s CSS variables, which can
be used both within stylesheets and runtime code.

**NOTE:** You should only write custom CSS if you’re unable to use
[the Box primitive](#the-box-primitive).

```jsx
import { css, tokenSchema } from '@voussoir/style';

function SomeComponent(props) {
  return (
    <div
      className={css({
        padding: tokenSchema.size.space.large,
        // ...
      })}
      {...props}
    />
  );
}
```

TODO: just drop the entire schema here? probs not...

```jsx
{
  size: {
    radius: {
      full: 'var(--ksv-size-radius-full)',
      small: 'var(--ksv-size-radius-small)',
      regular: 'var(--ksv-size-radius-regular)',
      medium: 'var(--ksv-size-radius-medium)',
      large: 'var(--ksv-size-radius-large)',
    },
    border: {
      regular: 'var(--ksv-size-border-regular)',
      medium: 'var(--ksv-size-border-medium)',
      large: 'var(--ksv-size-border-large)',
    },
    element: {
      xsmall: 'var(--ksv-size-element-xsmall)',
      small: 'var(--ksv-size-element-small)',
      regular: 'var(--ksv-size-element-regular)',
      medium: 'var(--ksv-size-element-medium)',
      large: 'var(--ksv-size-element-large)',
    },
    icon: {
      small: 'var(--ksv-size-icon-small)',
      regular: 'var(--ksv-size-icon-regular)',
      medium: 'var(--ksv-size-icon-medium)',
      large: 'var(--ksv-size-icon-large)',
    },
    shadow: {
      small: 'var(--ksv-size-shadow-small)',
      medium: 'var(--ksv-size-shadow-medium)',
      large: 'var(--ksv-size-shadow-large)',
    },
    space: {
      xsmall: 'var(--ksv-size-space-xsmall)',
      small: 'var(--ksv-size-space-small)',
      regular: 'var(--ksv-size-space-regular)',
      medium: 'var(--ksv-size-space-medium)',
      large: 'var(--ksv-size-space-large)',
      xlarge: 'var(--ksv-size-space-xlarge)',
      xxlarge: 'var(--ksv-size-space-xxlarge)',
    },
  },
  color: {
    shadow: {
      muted: 'var(--ksv-color-shadow-muted)',
      regular: 'var(--ksv-color-shadow-regular)',
      emphasis: 'var(--ksv-color-shadow-emphasis)',
    },
    foreground: {
      neutral: 'var(--ksv-color-foreground-neutral)',
      emphasis: 'var(--ksv-color-foreground-emphasis)',
      muted: 'var(--ksv-color-foreground-muted)',
      onEmphasis: 'var(--ksv-color-foreground-on-emphasis)',
      accent: 'var(--ksv-color-foreground-accent)',
      positive: 'var(--ksv-color-foreground-positive)',
      caution: 'var(--ksv-color-foreground-caution)',
      critical: 'var(--ksv-color-foreground-critical)',
      pending: 'var(--ksv-color-foreground-pending)',
      highlight: 'var(--ksv-color-foreground-highlight)',
    },
    background: {
      canvas: 'var(--ksv-color-background-canvas)',
      surface: 'var(--ksv-color-background-surface)',
      surfaceSecondary: 'var(--ksv-color-background-surface-secondary)',
      surfaceTertiary: 'var(--ksv-color-background-surface-tertiary)',
      accent: 'var(--ksv-color-background-accent)',
      accentEmphasis: 'var(--ksv-color-background-accent-emphasis)',
      positive: 'var(--ksv-color-background-positive)',
      positiveEmphasis: 'var(--ksv-color-background-positive-emphasis)',
      caution: 'var(--ksv-color-background-caution)',
      cautionEmphasis: 'var(--ksv-color-background-caution-emphasis)',
      critical: 'var(--ksv-color-background-critical)',
      criticalEmphasis: 'var(--ksv-color-background-critical-emphasis)',
      pending: 'var(--ksv-color-background-pending)',
      pendingEmphasis: 'var(--ksv-color-background-pending-emphasis)',
      highlight: 'var(--ksv-color-background-highlight)',
      highlightEmphasis: 'var(--ksv-color-background-highlight-emphasis)',
    },
    border: {
      muted: 'var(--ksv-color-border-muted)',
      neutral: 'var(--ksv-color-border-neutral)',
      emphasis: 'var(--ksv-color-border-emphasis)',
      accent: 'var(--ksv-color-border-accent)',
      positive: 'var(--ksv-color-border-positive)',
      caution: 'var(--ksv-color-border-caution)',
      critical: 'var(--ksv-color-border-critical)',
      pending: 'var(--ksv-color-border-pending)',
      highlight: 'var(--ksv-color-border-highlight)',
    },
  },
  typography: {
    fontFamily: {
      base: 'var(--ksv-typography-font-family-base)',
      code: 'var(--ksv-typography-font-family-code)',
    },
    fontWeight: {
      regular: 'var(--ksv-typography-font-weight-regular)',
      medium: 'var(--ksv-typography-font-weight-medium)',
      semibold: 'var(--ksv-typography-font-weight-semibold)',
      bold: 'var(--ksv-typography-font-weight-bold)',
    },
    lineheight: {
      large: 'var(--ksv-typography-lineheight-large)',
      medium: 'var(--ksv-typography-lineheight-medium)',
      small: 'var(--ksv-typography-lineheight-small)',
    },
  },
  animation: {
    duration: {
      short: 'var(--ksv-animation-duration-short)',
      regular: 'var(--ksv-animation-duration-regular)',
      long: 'var(--ksv-animation-duration-long)',
    },
  },
};
```

## Escape hatches

We encourage folks to use Voussoir components "as is", however we realise that
sometimes customisations may be needed.

While the `className` and `style` props are not supported in Voussoir
components, there are two escape hatches that you can **use at your own risk**.
These are `UNSAFE_className` and `UNSAFE_style`, which should be considered a
**last resort**. They can be used to work around bugs or limitations in
Voussoir, but should not be employed long term.

The reasoning behind this is that future updates may cause unintended breaking
changes in modified components. If the internal DOM structure or CSS properties
of a Voussoir component change, this may lead to conflicts with CSS overrides in
your code. For this reason, `className` and `style` are unsafe, and if you use
them know that you are doing so at your own risk.
