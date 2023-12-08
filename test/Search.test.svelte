<script lang="ts">
  import Search from "../src";
  import SearchComponent from "../src/Search.svelte";

  let value = "";
  let events: string[] = [];
</script>

<Search
  bind:value
  label="My label"
  hideLabel
  placeholder="Placeholder text..."
  debounce={800}
  removeFormAriaAttributes={true}
  on:submit
  on:focus
  on:blur
  on:type={(e) => (events = [...events, e.detail])}
  on:clear
  on:keydown
  on:input
>
  <span slot="label">Custom label</span>
</Search>

<SearchComponent bind:value />
