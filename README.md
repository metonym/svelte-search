# svelte-search

[![NPM][npm]][npm-url]
[![Build][build]][build-badge]

> Customizable search component for Svelte.

## Install

```bash
yarn add -D svelte-search
# OR
npm i -D svelte-search
```

## Usage

### Styling

Note: the component is unstyled by default. You can target the component using the `.svelte-search` class selector.

```css
:global(.svelte-search input) {
  font-size: 1.5rem;
  padding: 1rem;
  border: 2px solid #e0e0e0;
}
```

### Basic

```svelte
<script>
  import Search from "svelte-search";

  let value = "";
</script>

<style global>
.svelte-search input {
  width: 100%;
  font-size: 1.25rem;
  padding: .5rem;
  margin: .5rem 0;
  border: 2px solid #e0e0e0;
  border-radius: 0.25rem;
}
</style>

<Search bind:value />

Value: {value}
```

### Debounced input

Debounce the search input by setting `debounce` to `true`.

Adjust the debounce value using `debounceValue` in milliseconds. The default is `250`ms.

```svelte
<script>
  let type = [];
</script>

<Search bind:value debounce debounceValue="{800}" on:type={() => { type = [...type, value]; }} />

{#each type as entry}
  <div>{entry}</div>
{/each}
```

## API

This component forwards `$$restProps` to the input element.

| Prop name     | Value                          |
| :------------ | :----------------------------- |
| id            | `string`                       |
| label         | `string` (default: `"Search"`) |
| hideLabel     | `boolean` (default: `false`)   |
| name          | `string` (default: `"search"`) |
| value         | `string` (default: `"value"`)  |
| debounce      | `boolean` (default: `false`)   |
| debounceValue | `number` (default: `250`)      |

## Forwarded events

| Event name   | Description                                                                                                      |
| :----------- | :--------------------------------------------------------------------------------------------------------------- |
| `on:input`   | triggered if the value changes                                                                                   |
| `on:type`    | alias for `on:input`; dispatched when `debounce` is enabled                                                      |
| `on:submit`  | forwarded to the `form` element; triggered when pressing the "Enter" key                                         |
| `on:change`  | triggered if the value changes after blurring                                                                    |
| `on:focus`   | triggered when the input element is focused                                                                      |
| `on:blur`    | triggered when the input element is blurred                                                                      |
| `on:keydown` | triggered when any key is pressed [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Document/keydown_event) |

## Notes

- The `keypress` event is not forwarded because it is [deprecated](https://developer.mozilla.org/en-US/docs/Web/API/Document/keypress_event)

## [Changelog](CHANGELOG.md)

## License

[MIT](LICENSE)

[npm]: https://img.shields.io/npm/v/svelte-search.svg?color=blue
[npm-url]: https://npmjs.com/package/svelte-search
[build]: https://travis-ci.com/metonym/svelte-search.svg?branch=master
[build-badge]: https://travis-ci.com/metonym/svelte-search
