<script>
  import Search from "svelte-search";

  let ref = undefined;
  let value = "";
  let events = [];

  function logEvent(type) {
    events = [...events, { type: `on:${type}`, value }];
  }
</script>

<style>
  :global(.svelte-search input) {
    border: 0;
    background: none;
    width: 100%;
    font: inherit;
    font-size: 1.5rem;
    padding: 1rem;
    border: 2px solid #e0e0e0;
    border-radius: 0.25rem;
  }

  :global(.svelte-search input:focus) {
    outline: 0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: #0f62fe;
  }

  h2 {
    font-size: 0.75rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.1rem;
    margin-bottom: 0.5rem;
    margin-top: 1rem;
  }

  .padding {
    padding: 1rem;
  }

  ul {
    list-style: none;
  }

  li {
    color: #393939;
    padding: 0.5rem 0;
    border-bottom: 1px solid #e0e0e0;
  }

  .tag {
    font-size: 0.875rem;
    padding: 0.25rem;
    color: #393939;
    background-color: #f4f4f4;
    border-radius: 0.25rem;
  }

  .tag:before {
    content: "“";
  }

  .tag:after {
    content: "”";
  }

  button {
    background: none;
    border: 0;
    cursor: pointer;
    font: inherit;
    font-size: 0.875rem;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    outline: 2px solid #e0e0e0;
    margin-right: 0.5rem;
    margin-bottom: 0.25rem;
  }

  button:active {
    outline-color: #0f62fe;
    color: #0f62fe;
  }

  button:focus {
    outline-color: #0f62fe;
  }

  .buttons {
    margin-top: 1rem;
  }
</style>

<svelte:head>
  <title>svelte-search</title>
</svelte:head>

<Search
  bind:this={ref}
  spellcheck={false}
  autofocus
  hideLabel
  debounce
  debounceValue={800}
  bind:value
  placeholder="Enter text..."
  on:submit={() => {
    logEvent('submit');
  }}
  on:focus={() => {
    logEvent('focus');
  }}
  on:blur={() => {
    logEvent('blur');
  }}
  on:change={() => {
    logEvent('change');
  }}
  on:type={() => {
    logEvent('type');
  }}
  on:clear={() => {
    logEvent('clear');
  }} />

<div class="padding">
  <h2>Bound value</h2>
  <span class="tag">{value}</span>
</div>

<div class="buttons">
  <button
    type="button"
    on:click={() => {
      ref.clear();
    }}>
    Clear input
  </button>

  <button
    type="button"
    on:click={() => {
      ref.focus();
    }}>
    Focus input
  </button>
</div>

<ul class="padding">
  <h2>Events</h2>
  {#each events as event}
    <li>
      {#if event.type === 'on:type'}(debounced){/if}
      {event.type}
      <span class="tag">{event.value}</span>
    </li>
  {/each}
</ul>
