<script>
  /**
   * @event {string} type
   * @event {any} clear
   */

  export let value = "";
  export let autofocus = false;
  export let debounce = 0;
  export let label = "Label";
  export let hideLabel = false;
  export let id = "search" + Math.random().toString(36);
  export let ref = null;
  export let removeFormAriaAttributes = false;

  import { createEventDispatcher, onMount, afterUpdate } from "svelte";

  const dispatch = createEventDispatcher();

  let prevValue = value;
  let timeout = undefined;
  let calling = false;

  function debounced(cb) {
    if (calling) return;
    calling = true;
    timeout = setTimeout(() => {
      cb();
      calling = false;
    }, debounce);
  }

  onMount(() => {
    if (autofocus) window.requestAnimationFrame(() => ref.focus());
    return () => clearTimeout(timeout);
  });

  afterUpdate(() => {
    if (value.length > 0 && value !== prevValue) {
      if (debounce > 0) {
        debounced(() => dispatch("type", value));
      } else {
        dispatch("type", value);
      }
    }

    if (value.length === 0 && prevValue.length > 0) dispatch("clear");

    prevValue = value;
  });
</script>

<form
  data-svelte-search
  role={removeFormAriaAttributes ? null : "search"}
  aria-labelledby={removeFormAriaAttributes ? null : id}
  on:submit|preventDefault
>
  <label id="{id}-label" for={id} class:hide-label={hideLabel}>
    <slot name="label">{label}</slot>
  </label>
  <input
    bind:this={ref}
    name="search"
    type="search"
    placeholder="Search..."
    autocomplete="off"
    spellcheck="false"
    {...$$restProps}
    {id}
    bind:value
    on:input
    on:change
    on:focus
    on:blur
    on:keydown
  />
</form>

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
