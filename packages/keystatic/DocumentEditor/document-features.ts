import { BasicStringFormField } from './component-blocks/fields/document';

export type DocumentFeatures = {
  formatting: {
    inlineMarks: {
      bold: boolean;
      italic: boolean;
      underline: boolean;
      strikethrough: boolean;
      code: boolean;
      superscript: boolean;
      subscript: boolean;
      keyboard: boolean;
    };
    listTypes: {
      ordered: boolean;
      unordered: boolean;
    };
    alignment: {
      center: boolean;
      end: boolean;
    };
    headingLevels: (1 | 2 | 3 | 4 | 5 | 6)[];
    blockTypes: {
      blockquote: boolean;
      code: boolean;
    };
    softBreaks: boolean;
  };
  links: boolean;
  images:
    | false
    | {
        directory?: string;
        publicPath?: string;
        schema: {
          alt: BasicStringFormField;
          title: BasicStringFormField;
        };
      };
  dividers: boolean;
  layouts: [number, ...number[]][];
  tables: boolean;
};
