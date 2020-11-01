# svelte-search

[![NPM][npm]][npm-url]
[![Build][build]][build-badge]

> Customizable search component for Svelte.

## Install

```sh
yarn add -D svelte-search
```

## Usage

```svelte
<script>
  import Search from "svelte-search";

  let value = "";
</script>

<Search bind:value on:submit="{() => { console.log('search for', value); }}" />
```

### Debounced value

Debounce the search input by using the `debounce` prop.

The default `debounceValue` is `250` ms.

```svelte
<script>
  import Search from "svelte-search";

  let value = "";
</script>

<Search bind:value debounce debounceValue="{800}" />
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
| `on:change`  | triggered if the value changes after blurring                                                                    |
| `on:focus`   | triggered when the input element is focused                                                                      |
| `on:blur`    | triggered when the input element is blurred                                                                      |
| `on:keydown` | triggered when any key is pressed [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Document/keydown_event) |

## Input clear and focus

### Declarative

```svelte
<!-- Focus -->
<Search autofocus />

<!-- Clear -->
<Search value="" />
```

### Imperative (programmatic)

```svelte
<script>
  import Search from "svelte-search";

  let ref;
</script>

<Search bind:ref />

<!-- Focus -->
<button on:click={() => { ref.focus(); }}>Focus</button>

<!-- Clear -->
<button on:click={() => { ref.clear(); }}>Clear</button>
```

## Notes

- The `keypress` event is not forwarded because it is [deprecated](https://developer.mozilla.org/en-US/docs/Web/API/Document/keypress_event)

## [Changelog](CHANGELOG.md)

## License

[MIT](LICENSE)

[npm]: https://img.shields.io/npm/v/svelte-search.svg?color=blue
[npm-url]: https://npmjs.com/package/svelte-search
[build]: https://travis-ci.com/metonym/svelte-search.svg?branch=master
[build-badge]: https://travis-ci.com/metonym/svelte-search
