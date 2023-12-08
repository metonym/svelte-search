import type { SvelteComponentTyped } from "svelte";
import type { SvelteHTMLElements } from "svelte/elements";

type RestProps = SvelteHTMLElements["input"];

export interface SearchProps extends RestProps {
  /**
   * Specify the input value
   * @default ""
   */
  value?: string;

  /**
   * Set to `true` to auto focus the input on mount
   * @default false
   */
  autofocus?: boolean;

  /**
   * Specify the debounce value in milliseconds (ms)
   * @default 0
   */
  debounce?: number;

  /**
   * Specify the input label text
   * @default "Label"
   */
  label?: string;

  /**
   * Set to `true` to visually hide the label
   * @default false
   */
  hideLabel?: boolean;

  /**
   * Specify an `id` for the `input`
   * @default "search" + Math.random().toString(36)
   */
  id?: string;

  /**
   * Obtain a reference to the `input` element
   * @default null
   */
  ref?: null | HTMLInputElement;

  /**
   * Set to `true` to omit the form `role="search"` attribute
   * @default false
   */
  removeFormAriaAttributes?: boolean;
}

export default class extends SvelteComponentTyped<
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
