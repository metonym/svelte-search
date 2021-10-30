# svelte-search

[![NPM][npm]][npm-url]

> Customizable search input component for Svelte.

<!-- REPO_URL -->

This search component is composed using semantic `form` and `input` elements.

See [svelte-typeahead](https://github.com/metonym/svelte-typeahead) for a search component with dropdown results.

---

<!-- TOC -->

## Installation

**Yarn**

```bash
yarn add -D svelte-search
```

**NPM**

```bash
npm i -D svelte-search
```

**pnpm**

```bash
pnpm i -D svelte-search
```

## Styling

This component is unstyled by design. Target the component using the `[data-svelte-search]` selector.

```css
:global([data-svelte-search] input) {
  font-size: 1.5rem;
  padding: 1rem;
  border: 2px solid #e0e0e0;
}
```

## Usage

### Two-way binding

```svelte
<script>
  import Search from "svelte-search";

  let value = "";
</script>

<Search bind:value />

{#if value}
  <button on:click={() => (value = "")}>Clear "{value}"</button>
{/if}
```

### Label with placeholder text

`$$restProps` are forwarded to the input element.

```svelte
<Search label="My label" placeholder="Placeholder text..." />
```

### Label slot

```svelte
<Search>
  <span slot="label" style="color: red;">Custom label</span>
</Search>
```

### Visually hidden label

Set `hideLabel` to `true` to visually hide the label.

```svelte
<Search hideLabel label="My label" placeholder="Placeholder text..." />
```

### Focus (declarative)

Use the `autofocus` prop to declaratively focus the input.

```svelte no-eval
<Search autofocus />
```

### Focus (programmatic)

Bind the `ref` prop to programmatically focus the input.

```svelte
<script>
  import Search from "svelte-search";

  let ref = null;
</script>

<Search bind:ref />

<button on:click={() => ref.focus()}>Focus</button>
```

### Debounced input

Use the `debounce` prop to specify the debounce value in milliseconds.

```svelte
<script>
  import Search from "svelte-search";

  let events = [];
</script>

<Search
  bind:value
  debounce={800}
  on:type={() => (events = [...events, value])}
/>

{#each events as event}
  <div>{event}</div>
{/each}
```

## API

This component forwards `$$restProps` to the input element.

### Props

| Prop name                | Type               | Default value                           |
| :----------------------- | :----------------- | :-------------------------------------- |
| value                    | `string`           | `""`                                    |
| label                    | `string`           | `"Search"`                              |
| hideLabel                | `boolean`          | `false`                                 |
| debounce                 | `number`           | `0`                                     |
| ref                      | `HTMLInputElement` | `null`                                  |
| name                     | `string`           | `"search"`                              |
| id                       | `string`           | `"search" + Math.random().toString(36)` |
| removeFormAriaAttributes | `boolean`          | `false`                                 |
| autofocus                | `boolean`          | `false`                                 |

### Forwarded events

- on:input
- on:change
- on:submit
- on:focus
- on:blur
- on:keydown

### Dispatched events

- **on:type**: fired when the the input value is updated
- **on:clear**: fired when clicking the "X" button to clear the input value

```svelte
<Search
  on:type={(e) => {
    console.log("type", e.detail); // input value
  }}
  on:clear={() => {
    console.log("clear");
  }}
/>
```

## TypeScript

Svelte version 3.31 or greater is required to use this component with TypeScript.

TypeScript definitions are located in the [types folder](./types).

## Changelog

[Changelog](CHANGELOG.md)

## License

[MIT](LICENSE)

[npm]: https://img.shields.io/npm/v/svelte-search.svg?color=%23ff3e00&style=for-the-badge
[npm-url]: https://npmjs.com/package/svelte-search
