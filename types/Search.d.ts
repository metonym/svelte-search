/// <reference types="svelte" />

export interface SearchProps extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap["input"]> {
  /**
   * @default "search" + Math.random().toString(36)
   */
  id?: string;

  /**
   * @default "Search"
   */
  label?: string;

  /**
   * @default false
   */
  hideLabel?: boolean;

  /**
   * @default "search"
   */
  name?: string;

  /**
   * @default ""
   */
  value?: string;

  /**
   * @default false
   */
  debounce?: boolean;

  /**
   * @default 250
   */
  debounceValue?: number;

  /**
   * @default () => { value = ""; }
   */
  clear?: () => any;

  /**
   * @default () => { input.focus(); }
   */
  focus?: () => any;
}

export default class Search {
  $$prop_def: SearchProps;
  $$slot_def: {};

  $on(eventname: "submit", cb: (event: WindowEventMap["submit"]) => void): () => void;
  $on(eventname: "input", cb: (event: WindowEventMap["input"]) => void): () => void;
  $on(eventname: "change", cb: (event: WindowEventMap["change"]) => void): () => void;
  $on(eventname: "focus", cb: (event: WindowEventMap["focus"]) => void): () => void;
  $on(eventname: "blur", cb: (event: WindowEventMap["blur"]) => void): () => void;
  $on(eventname: "keydown", cb: (event: WindowEventMap["keydown"]) => void): () => void;
  $on(eventname: "type", cb: (event: CustomEvent<any>) => void): () => void;
  $on(eventname: "clear", cb: (event: CustomEvent<any>) => void): () => void;
  $on(eventname: string, cb: (event: Event) => void): () => void;
}
