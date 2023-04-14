import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  plugins: [svelte()],
  appType: "spa",
  server: {
    port: 80,
  },
  preview: {
    port: 80,
  },
});
