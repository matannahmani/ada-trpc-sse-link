import { type ReactNode } from "react";

declare global {
  namespace JSX {
    type ElementType =
      | keyof JSX.IntrinsicElements
      // rome-ignore lint/suspicious/noExplicitAny: <explanation>
      | React.ComponentType<any>
      // rome-ignore lint/suspicious/noExplicitAny: <explanation>
      | ((props: any) => Promise<ReactNode> | ReactNode);
  }
}
