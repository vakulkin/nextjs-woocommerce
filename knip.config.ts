import type { KnipConfig } from "knip";

const config: KnipConfig = {
  ignore: [
    // shadcn UI components intentionally export their full surface area (sub-components,
    // variants) as a component-library public API even when not all are consumed locally.
    "components/ui/**",
  ],
  ignoreExportsUsedInFile: true,
};

export default config;
