/// <reference types="vite-react-ssg" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Pre-render every route to real HTML (nested: /foo/ -> dist/foo/index.html).
  ssgOptions: {
    dirStyle: "nested",
    script: "async",
    formatting: "none",
    beastiesOptions: false,
  },
}));
