import "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "ion-icon": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          name?: string;
          style?: React.CSSProperties;
        },
        HTMLElement
      >;
    }
  }
}

