<script lang="ts">
  import Search from "./types";

  let value = "";
  let events = [];
</script>

<Search
  bind:value
  label="My label"
  placeholder="Placeholder text..."
  debounce={800}
  on:type={(e) => (events = [...events, e.detail])}
  on:clear>
  <span slot="label">Custom label</span>
</Search>

{value}
