/// <reference types="svelte" />
import { SvelteComponentTyped } from "svelte";

export interface SearchProps
  extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap["input"]> {
  /**
   * @default ""
   */
  value?: string;

  /**
   * @default false
   */
  autofocus?: boolean;

  /**
   * @default 0
   */
  debounce?: number;

  /**
   * @default "Label"
   */
  label?: string;

  /**
   * @default false
   */
  hideLabel?: boolean;

  /**
   * @default "search" + Math.random().toString(36)
   */
  id?: string;

  /**
   * @default null
   */
  ref?: null | HTMLInputElement;

  /**
   * @default false
   */
  removeFormAriaAttributes?: boolean;
}

export default class Search extends SvelteComponentTyped<
  SearchProps,
  {
    type: CustomEvent<string>;
    clear: CustomEvent<any>;
    submit: WindowEventMap["submit"];
    input: WindowEventMap["input"];
    change: WindowEventMap["change"];
    focus: WindowEventMap["focus"];
    blur: WindowEventMap["blur"];
    keydown: WindowEventMap["keydown"];
  },
  { label: {} }
> {}
