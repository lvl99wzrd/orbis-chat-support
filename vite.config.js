import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      process: "process/browser",
      stream: "stream-browserify",
      zlib: "browserify-zlib",
      util: "util",
      web3: resolve(__dirname, "./node_modules/web3/dist/web3.min.js"),
      "./runtimeConfig": "./runtimeConfig.browser",
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "es2020",
    },
  },
  build: {
    cssCodeSplit: false,
    lib: {
      entry: "./src/OrbisChatSupport.js",
      formats: ["es", "cjs"],
      name: "OrbisChatSupport",
      fileName: (format) => (format === "es" ? "index.js" : "index.cjs"),
    },
    rollupOptions: {
      external: [
        "vue",
        "@orbisclub/orbis-sdk",
        "ethereum-blockies-base64",
        "buffer",
        "events",
        "process",
        "util",
      ],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
    target: "es2020",
  },
});
