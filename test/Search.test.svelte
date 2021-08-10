<script lang="ts">
  import Search from "../types";

  let value = "";
  let events: string[] = [];
</script>

<Search
  bind:value
  label="My label"
  placeholder="Placeholder text..."
  debounce={800}
  removeFormAriaAttributes={true}
  on:type={(e) => (events = [...events, e.detail])}
  on:clear
>
  <span slot="label">Custom label</span>
</Search>

{value}
