<script>
  export let id = "search" + Math.random().toString(36);
  export let label = "Search";
  export let hideLabel = false;
  export let name = "search";
  export let value = "";
  export let debounce = false;
  export let debounceValue = 250;
  export function clear() {
    value = "";
  }
  export function focus() {
    input.focus();
  }

  import { createEventDispatcher, onMount, afterUpdate } from "svelte";

  const dispatch = createEventDispatcher();

  let prevValue = value;
  let input = undefined;
  let calling = false;
  let timeout = undefined;

  function debounced(cb) {
    if (calling) return;

    calling = true;

    timeout = setTimeout(() => {
      cb();
      calling = false;
    }, debounceValue);
  }

  onMount(() => {
    if ($$props.autofocus) {
      window.requestAnimationFrame(() => {
        input.focus();
      });
    }

    return () => {
      if (timeout !== undefined) {
        clearTimeout(timeout);
      }
    };
  });

  afterUpdate(() => {
    if (value.length > 0 && value !== prevValue) {
      if (debounce) {
        debounced(() => dispatch("type"));
      } else {
        dispatch("type");
      }
    }

    if (value.length === 0 && prevValue.length > 0) {
      dispatch("clear");
    }

    prevValue = value;
  });
</script>

<style>
  /**
  * Visually hide content without breaking screen readers
  * https://a11yproject.com/posts/how-to-hide-content/
  */
  .hide-label {
    position: absolute;
    height: 1px;
    width: 1px;
    overflow: hidden;
    clip: rect(1px 1px 1px 1px);
    clip: rect(1px, 1px, 1px, 1px);
    white-space: nowrap;
  }
</style>

<form
  class="svelte-search"
  role="search"
  aria-labelledby={id}
  on:submit|preventDefault>
  <label id="{id}-label" for={id} class:hide-label={hideLabel}>{label}</label>
  <input
    {...$$restProps}
    bind:this={input}
    type="search"
    {id}
    {name}
    bind:value
    on:input
    on:change
    on:focus
    on:blur
    on:keydown />
</form>
