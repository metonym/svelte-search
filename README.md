# svelte-search

[![NPM][npm]][npm-url]

> Customizable search input component for Svelte.

<!-- TOC -->

## Install

```bash
yarn add -D svelte-search
# OR
npm i -D svelte-search
```

## Usage

### Styling

**Note:** this component is unstyled by default. You can target the component using the `[data-svelte-search]` selector.

```css
:global([data-svelte-search] input) {
  font-size: 1.5rem;
  padding: 1rem;
  border: 2px solid #e0e0e0;
}
```

### Basic

<!-- prettier-ignore-start -->
```svelte
<script>
  import Search from "svelte-search";

  let value = "";
</script>

<Search bind:value />

{value}
```
<!-- prettier-ignore-end -->

### Label + placeholder

`$$restProps` are forwarded to the input element.

<!-- prettier-ignore-start -->
```svelte
<Search label="My label" placeholder="Placeholder text..." />
```
<!-- prettier-ignore-end -->

### Autofocus

<!-- prettier-ignore-start -->
```html
<Search autofocus />
```
<!-- prettier-ignore-end -->

### Focus programmatically

<!-- prettier-ignore-start -->
```svelte
<script>
  let ref = null;
</script>

<Search bind:ref />

<button type="button" on:click={() => ref.focus()}>
  Focus
</button>
```
<!-- prettier-ignore-end -->

### Debounced input

Use the `debounce` prop to specify the debounce value in milliseconds.

<!-- prettier-ignore-start -->
```svelte
<script>
  let events = [];
</script>

<Search
  bind:value
  debounce={800}
  on:type={() => events = [...events, value]}
/>

{#each events as event}
  <div>{event}</div>
{/each}
```
<!-- prettier-ignore-end -->

### Label slot

<!-- prettier-ignore-start -->
```svelte
<Search>
  <span slot="label">Custom label</span>
</Search>
```
<!-- prettier-ignore-end -->

## API

This component forwards `$$restProps` to the input element.

### Props

| Prop name     | Value                          |
| :------------ | :----------------------------- |
| id            | `string`                       |
| label         | `string` (default: `"Search"`) |
| hideLabel     | `boolean` (default: `false`)   |
| name          | `string` (default: `"search"`) |
| value         | `string` (default: `"value"`)  |
| debounce      | `boolean` (default: `false`)   |
| debounceValue | `number` (default: `250`)      |

### Forwarded events

- on:input
- on:type
- on:submit
- on:change
- on:focus
- on:blur
- on:keydown

### Dispatched events

- on:type
- on:clear

<!-- prettier-ignore-start -->
```svelte
<Search
  on:type={(e) => {
    console.log("type", e.detail); // string
  }}
  on:clear={(e) => {
    console.log("clear");
  }} />
````
<!-- prettier-ignore-end -->

## TypeScript

Svelte version 3.31 or greater is required to use this component with TypeScript.

## Changelog

[Changelog](CHANGELOG.md)

## License

[MIT](LICENSE)

[npm]: https://img.shields.io/npm/v/svelte-search.svg?color=%23161616
[npm-url]: https://npmjs.com/package/svelte-search

```

```
