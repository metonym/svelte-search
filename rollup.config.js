import resolve from "@rollup/plugin-node-resolve";
import svelte from "rollup-plugin-svelte";
import svelteReadme from "svelte-readme";
import pkg from "./package.json";

export default () => {
  if (!process.env.BUNDLE) {
    return svelteReadme({
      style: `
        [data-svelte-search] input {
          width: 100%;
          font-size: 1rem;
          padding: .5rem;
          margin: .5rem 0;
          border: 1px solid #e0e0e0;
          border-radius: 0.25rem;
        }
      `
    });
  }

  return ["es", "umd"].map((format) => {
    const UMD = format === "umd";

    return {
      input: pkg.svelte,
      output: {
        format,
        file: UMD ? pkg.main : pkg.module,
        name: UMD ? pkg.name : undefined,
      },
      plugins: [svelte({ emitCss: false }), resolve()],
    };
  });
};
