/** @jest-environment jsdom */
/** @jsxRuntime classic */
/** @jsx jsx */
import { Transforms, Editor } from 'slate';
import React, { ReactElement } from 'react';
import { jsx, makeEditor } from '../tests/utils';
import { component, fields } from './api';
import { createGetPreviewProps } from './preview-props';
import { ChildFieldEditable } from './component-block-render';
import { insertComponentBlock } from '.';

const objectProp = fields.object({
  prop: fields.text({ label: 'Prop' }),
  block: fields.child({ kind: 'block', placeholder: '' }),
  inline: fields.child({ kind: 'inline', placeholder: '' }),
  many: fields.relationship({
    label: 'Relationship',
    collection: 'many',
  }),
  select: fields.select({
    label: 'Select',
    defaultValue: 'a',
    options: [
      { label: 'A', value: 'a' },
      { label: 'B', value: 'b' },
    ],
  }),
  conditional: fields.conditional(fields.checkbox({ label: 'Conditional' }), {
    true: fields.child({ kind: 'block', placeholder: '' }),
    false: fields.relationship({ label: 'Relationship', collection: 'one' }),
  }),
  conditionalSelect: fields.conditional(
    fields.select({
      label: 'Conditional Select',
      defaultValue: 'a',
      options: [
        { label: 'A', value: 'a' },
        { label: 'B', value: 'b' },
      ],
    } as const),
    {
      a: fields.text({ label: 'A in Conditional Select' }),
      b: fields.text({ label: 'B in Conditional Select', defaultValue: 'B' }),
    }
  ),
});

const componentBlocks = {
  void: component({
    preview: () => null,
    label: 'Void',
    schema: { text: fields.text({ label: 'Text' }) },
  }),
  complex: component({
    preview: props => {
      return React.createElement(
        'div',
        null,
        props.fields.object.fields.block.element,
        props.fields.object.fields.inline.element,
        props.fields.object.fields.conditional.discriminant &&
          props.fields.object.fields.conditional.value.element
      );
    },
    label: 'Complex',
    schema: {
      object: objectProp,
    },
  }),
};

test('inserting a void component block', () => {
  let editor = makeEditor(
    <editor>
      <paragraph>
        <text>
          <cursor />
        </text>
      </paragraph>
    </editor>,
    { componentBlocks }
  );
  insertComponentBlock(editor, componentBlocks, 'void');
  expect(editor).toMatchInlineSnapshot(`
    <editor>
      <component-block
        component="void"
        props={
          {
            "text": "",
          }
        }
      >
        <component-inline-prop>
          <text>
            <cursor />
          </text>
        </component-inline-prop>
      </component-block>
      <paragraph>
        <text />
      </paragraph>
    </editor>
  `);
});

test('inserting a complex component block', () => {
  let editor = makeEditor(
    <editor>
      <paragraph>
        <text>
          <cursor />
        </text>
      </paragraph>
    </editor>,
    { componentBlocks }
  );
  insertComponentBlock(editor, componentBlocks, 'complex');
  expect(editor).toMatchInlineSnapshot(`
    <editor>
      <component-block
        component="complex"
        props={
          {
            "object": {
              "block": null,
              "conditional": {
                "discriminant": false,
                "value": null,
              },
              "conditionalSelect": {
                "discriminant": "a",
                "value": "",
              },
              "inline": null,
              "many": null,
              "prop": "",
              "select": "a",
            },
          }
        }
      >
        <component-block-prop
          propPath={
            [
              "object",
              "block",
            ]
          }
        >
          <paragraph>
            <text>
              <cursor />
            </text>
          </paragraph>
        </component-block-prop>
        <component-inline-prop
          propPath={
            [
              "object",
              "inline",
            ]
          }
        >
          <text />
        </component-inline-prop>
      </component-block>
      <paragraph>
        <text />
      </paragraph>
    </editor>
  `);
});

const getPreviewProps = (editor: Editor) =>
  createGetPreviewProps(
    { kind: 'object', fields: componentBlocks.complex.schema },
    props => {
      Transforms.setNodes(
        editor,
        { props: props((editor.children[0] as any).props) },
        { at: [0] }
      );
    },
    (path): ReactElement => React.createElement(ChildFieldEditable, { path })
  )((editor.children[0] as any).props);

const makeEditorWithComplexComponentBlock = () =>
  makeEditor(
    <editor>
      <component-block
        component="complex"
        props={{
          object: {
            block: null,
            conditional: {
              discriminant: false,
              value: null,
            },
            prop: '',
            select: 'a',
            conditionalSelect: {
              discriminant: 'a',
              value: '',
            },
            inline: null,
            many: '',
          },
        }}
      >
        <component-block-prop propPath={['object', 'block']}>
          <paragraph>
            <text>
              <cursor />
            </text>
          </paragraph>
        </component-block-prop>
        <component-inline-prop propPath={['object', 'inline']}>
          <text />
        </component-inline-prop>
      </component-block>
      <paragraph>
        <text />
      </paragraph>
    </editor>,
    { componentBlocks }
  );

test('preview props api', () => {
  let editor = makeEditorWithComplexComponentBlock();

  let previewProps = getPreviewProps(editor);
  const expectedPreviewProps: typeof previewProps = {
    schema: {
      kind: 'object',
      fields: componentBlocks.complex.schema,
    },
    fields: {
      object: {
        schema: componentBlocks.complex.schema.object,
        fields: {
          block: {
            element: React.createElement(ChildFieldEditable, {
              path: ['object', 'block'],
            }),
            schema: componentBlocks.complex.schema.object.fields.block,
          },
          conditional: {
            discriminant: false,
            schema: componentBlocks.complex.schema.object.fields.conditional,
            onChange: expect.any(Function) as any,
            value: {
              schema:
                componentBlocks.complex.schema.object.fields.conditional.values
                  .false,
              onChange: expect.any(Function) as any,
              value: null,
            },
          },
          conditionalSelect: {
            discriminant: 'a',
            schema:
              componentBlocks.complex.schema.object.fields.conditionalSelect,
            onChange: expect.any(Function) as any,
            value: {
              schema:
                componentBlocks.complex.schema.object.fields.conditionalSelect
                  .values.a,
              onChange: expect.any(Function) as any,
              value: '',
            },
          },
          inline: {
            element: React.createElement(ChildFieldEditable, {
              path: ['object', 'inline'],
            }),
            schema: componentBlocks.complex.schema.object.fields.inline,
          },
          many: {
            schema: componentBlocks.complex.schema.object.fields.many,
            value: '',
            onChange: expect.any(Function) as any,
          },
          prop: {
            schema: componentBlocks.complex.schema.object.fields.prop,
            onChange: expect.any(Function) as any,
            value: '',
          },
          select: {
            schema: componentBlocks.complex.schema.object.fields.select,
            onChange: expect.any(Function) as any,
            value: 'a',
          },
        },
        onChange: expect.any(Function) as any,
      },
    },
    onChange: expect.any(Function) as any,
  };
  expect(previewProps).toEqual(expectedPreviewProps);
});

test('preview props conditional change', () => {
  let editor = makeEditorWithComplexComponentBlock();

  let previewProps = getPreviewProps(editor);
  previewProps.fields.object.fields.conditional.onChange(true);
  expect(editor).toMatchInlineSnapshot(`
    <editor>
      <component-block
        component="complex"
        props={
          {
            "object": {
              "block": null,
              "conditional": {
                "discriminant": true,
                "value": null,
              },
              "conditionalSelect": {
                "discriminant": "a",
                "value": "",
              },
              "inline": null,
              "many": "",
              "prop": "",
              "select": "a",
            },
          }
        }
      >
        <component-block-prop
          propPath={
            [
              "object",
              "block",
            ]
          }
        >
          <paragraph>
            <text>
              <cursor />
            </text>
          </paragraph>
        </component-block-prop>
        <component-inline-prop
          propPath={
            [
              "object",
              "inline",
            ]
          }
        >
          <text />
        </component-inline-prop>
        <component-block-prop
          propPath={
            [
              "object",
              "conditional",
              "value",
            ]
          }
        >
          <paragraph>
            <text />
          </paragraph>
        </component-block-prop>
      </component-block>
      <paragraph>
        <text />
      </paragraph>
    </editor>
  `);
  const conditionalPreviewProps =
    getPreviewProps(editor).fields.object.fields.conditional;
  const expectedConditionalPreviewProps: typeof conditionalPreviewProps = {
    schema: componentBlocks.complex.schema.object.fields.conditional,
    discriminant: true,
    onChange: expect.any(Function) as any,
    value: {
      element: React.createElement(ChildFieldEditable, {
        path: ['object', 'conditional', 'value'],
      }),
      schema:
        componentBlocks.complex.schema.object.fields.conditional.values.true,
    },
  };
  expect(getPreviewProps(editor).fields.object.fields.conditional).toEqual(
    expectedConditionalPreviewProps
  );
});

test('preview props form change', () => {
  let editor = makeEditorWithComplexComponentBlock();

  let previewProps = getPreviewProps(editor);
  previewProps.fields.object.fields.select.onChange('b');
  expect((editor.children[0] as any).props.object.select).toBe('b');
  expect(getPreviewProps(editor).fields.object.fields.select.value).toBe('b');
});

function assert(condition: boolean): asserts condition {
  if (!condition) {
    throw new Error('condition is false');
  }
}

test('changing conditional with form inside', () => {
  let editor = makeEditorWithComplexComponentBlock();

  let previewProps = getPreviewProps(editor);
  assert(previewProps.fields.object.fields.conditional.discriminant === false);
  previewProps.fields.object.fields.conditionalSelect.onChange('b');

  expect((editor.children[0] as any).props.object.conditionalSelect)
    .toMatchInlineSnapshot(`
    {
      "discriminant": "b",
      "value": "B",
    }
  `);
  const conditionalSelectPreviewProps =
    getPreviewProps(editor).fields.object.fields.conditionalSelect;
  const expectedConditionalSelectPreviewProps: typeof conditionalSelectPreviewProps =
    {
      discriminant: 'b',
      schema: componentBlocks.complex.schema.object.fields.conditionalSelect,
      onChange: expect.any(Function) as any,
      value: {
        schema:
          componentBlocks.complex.schema.object.fields.conditionalSelect.values
            .b,
        onChange: expect.any(Function) as any,
        value: 'B',
      },
    };
  expect(
    getPreviewProps(editor).fields.object.fields.conditionalSelect
  ).toEqual(expectedConditionalSelectPreviewProps);
});

test('changing form inside conditional', () => {
  let editor = makeEditorWithComplexComponentBlock();

  let previewProps = getPreviewProps(editor);
  previewProps.fields.object.fields.conditionalSelect.value.onChange(
    'Some content'
  );

  expect((editor.children[0] as any).props.object.conditionalSelect)
    .toMatchInlineSnapshot(`
    {
      "discriminant": "a",
      "value": "Some content",
    }
  `);
  const conditionalSelectPreviewProps =
    getPreviewProps(editor).fields.object.fields.conditionalSelect;
  const expectedConditionalSelectPreviewProps: typeof conditionalSelectPreviewProps =
    {
      discriminant: 'a',
      schema: componentBlocks.complex.schema.object.fields.conditionalSelect,
      onChange: expect.any(Function) as any,
      value: {
        schema:
          componentBlocks.complex.schema.object.fields.conditionalSelect.values
            .a,
        onChange: expect.any(Function) as any,
        value: 'Some content',
      },
    };
  expect(conditionalSelectPreviewProps).toEqual(
    expectedConditionalSelectPreviewProps
  );
});
