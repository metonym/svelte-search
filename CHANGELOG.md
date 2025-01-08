# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.1](https://github.com/metonym/svelte-search/releases/tag/v2.1.1) - 2025-01-07

**Fixes**

- add `exports` field to `package.json`

## [2.1.0](https://github.com/metonym/svelte-search/releases/tag/v2.1.0) - 2024-05-04

**Features**

- set `action` attribute on form element

## [2.0.2](https://github.com/metonym/svelte-search/releases/tag/v2.0.2) - 2023-12-07

**Fixes**

- fix TypeScript definitions so `$$restProps` works with Svelte 4+
- co-locate TypeScript definitions with component source code

## [2.0.1](https://github.com/metonym/svelte-search/releases/tag/v2.0.1) - 2022-08-16

**Fixes**

- set `type="module"` in `package.json`

## [2.0.0](https://github.com/metonym/svelte-search/releases/tag/v2.0.0) - 2021-10-30

**Breaking Changes**

- remove style block and `.hideLabel` class; inline visually hidden styles instead
- drop support bundled ES/UMD formats
- use `.svelte.d.ts` extension for TypeScript definition

## [1.1.0](https://github.com/metonym/svelte-search/releases/tag/v1.1.0) - 2021-03-15

**Features**

- add `removeFormAriaAttributes` prop to remove form `role` and `aria-labelledby` (default is `false`)

## [1.0.0](https://github.com/metonym/svelte-search/releases/tag/v1.0.0) - 2020-12-31

**Breaking Changes**

- Combine `debounce` and `debounceValue`; default `debounce` value is `0`
- Use value for `e.detail` for dispatched "type" event
- Add `autofocus`, `ref` props
- Remove `name`, `clear`, `focus` props
- Use `SvelteComponentTyped` in TypeScript definitions

## [0.2.0](https://github.com/metonym/svelte-search/releases/tag/v0.2.0) - 2020-11-17

- Add TypeScript definitions

## [0.1.1](https://github.com/metonym/svelte-search/releases/tag/v0.1.1) - 2020-04-13

- Add id for label element

## [0.1.0](https://github.com/metonym/svelte-search/releases/tag/v0.1.0) - 2020-04-12

- Initial release
