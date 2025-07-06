// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.mjs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { storybookTest } from "file:///home/project/node_modules/@storybook/addon-vitest/dist/vitest-plugin/index.mjs";
var __vite_injected_original_dirname = "/home/project";
var __vite_injected_original_import_meta_url = "file:///home/project/vite.config.ts";
var dirname = typeof __vite_injected_original_dirname !== "undefined" ? __vite_injected_original_dirname : path.dirname(fileURLToPath(__vite_injected_original_import_meta_url));
var vite_config_default = defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["lucide-react"]
  },
  server: {
    proxy: {
      "/api": "http://localhost:4000"
    }
  },
  test: {
    projects: [{
      extends: true,
      plugins: [
        // The plugin will run tests for the stories defined in your Storybook config
        // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
        storybookTest({
          configDir: path.join(dirname, ".storybook")
        })
      ],
      test: {
        name: "storybook",
        browser: {
          enabled: true,
          headless: true,
          provider: "playwright",
          instances: [{
            browser: "chromium"
          }]
        },
        setupFiles: [".storybook/vitest.setup.ts"]
      }
    }]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjsvLy8gPHJlZmVyZW5jZSB0eXBlcz1cInZpdGVzdC9jb25maWdcIiAvPlxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuaW1wb3J0IHBhdGggZnJvbSAnbm9kZTpwYXRoJztcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGggfSBmcm9tICdub2RlOnVybCc7XG5pbXBvcnQgeyBzdG9yeWJvb2tUZXN0IH0gZnJvbSAnQHN0b3J5Ym9vay9hZGRvbi12aXRlc3Qvdml0ZXN0LXBsdWdpbic7XG5jb25zdCBkaXJuYW1lID0gdHlwZW9mIF9fZGlybmFtZSAhPT0gJ3VuZGVmaW5lZCcgPyBfX2Rpcm5hbWUgOiBwYXRoLmRpcm5hbWUoZmlsZVVSTFRvUGF0aChpbXBvcnQubWV0YS51cmwpKTtcblxuLy8gTW9yZSBpbmZvIGF0OiBodHRwczovL3N0b3J5Ym9vay5qcy5vcmcvZG9jcy9uZXh0L3dyaXRpbmctdGVzdHMvaW50ZWdyYXRpb25zL3ZpdGVzdC1hZGRvblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3JlYWN0KCldLFxuICBvcHRpbWl6ZURlcHM6IHtcbiAgICBleGNsdWRlOiBbJ2x1Y2lkZS1yZWFjdCddXG4gIH0sXG4gIHNlcnZlcjoge1xuICAgIHByb3h5OiB7XG4gICAgICAnL2FwaSc6ICdodHRwOi8vbG9jYWxob3N0OjQwMDAnXG4gICAgfVxuICB9LFxuICB0ZXN0OiB7XG4gICAgcHJvamVjdHM6IFt7XG4gICAgICBleHRlbmRzOiB0cnVlLFxuICAgICAgcGx1Z2luczogW1xuICAgICAgLy8gVGhlIHBsdWdpbiB3aWxsIHJ1biB0ZXN0cyBmb3IgdGhlIHN0b3JpZXMgZGVmaW5lZCBpbiB5b3VyIFN0b3J5Ym9vayBjb25maWdcbiAgICAgIC8vIFNlZSBvcHRpb25zIGF0OiBodHRwczovL3N0b3J5Ym9vay5qcy5vcmcvZG9jcy9uZXh0L3dyaXRpbmctdGVzdHMvaW50ZWdyYXRpb25zL3ZpdGVzdC1hZGRvbiNzdG9yeWJvb2t0ZXN0XG4gICAgICBzdG9yeWJvb2tUZXN0KHtcbiAgICAgICAgY29uZmlnRGlyOiBwYXRoLmpvaW4oZGlybmFtZSwgJy5zdG9yeWJvb2snKVxuICAgICAgfSldLFxuICAgICAgdGVzdDoge1xuICAgICAgICBuYW1lOiAnc3Rvcnlib29rJyxcbiAgICAgICAgYnJvd3Nlcjoge1xuICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgaGVhZGxlc3M6IHRydWUsXG4gICAgICAgICAgcHJvdmlkZXI6ICdwbGF5d3JpZ2h0JyxcbiAgICAgICAgICBpbnN0YW5jZXM6IFt7XG4gICAgICAgICAgICBicm93c2VyOiAnY2hyb21pdW0nXG4gICAgICAgICAgfV1cbiAgICAgICAgfSxcbiAgICAgICAgc2V0dXBGaWxlczogWycuc3Rvcnlib29rL3ZpdGVzdC5zZXR1cC50cyddXG4gICAgICB9XG4gICAgfV1cbiAgfVxufSk7Il0sCiAgIm1hcHBpbmdzIjogIjtBQUNBLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sV0FBVztBQUdsQixPQUFPLFVBQVU7QUFDakIsU0FBUyxxQkFBcUI7QUFDOUIsU0FBUyxxQkFBcUI7QUFQOUIsSUFBTSxtQ0FBbUM7QUFBeUYsSUFBTSwyQ0FBMkM7QUFRbkwsSUFBTSxVQUFVLE9BQU8scUNBQWMsY0FBYyxtQ0FBWSxLQUFLLFFBQVEsY0FBYyx3Q0FBZSxDQUFDO0FBRzFHLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQSxFQUNqQixjQUFjO0FBQUEsSUFDWixTQUFTLENBQUMsY0FBYztBQUFBLEVBQzFCO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixPQUFPO0FBQUEsTUFDTCxRQUFRO0FBQUEsSUFDVjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLE1BQU07QUFBQSxJQUNKLFVBQVUsQ0FBQztBQUFBLE1BQ1QsU0FBUztBQUFBLE1BQ1QsU0FBUztBQUFBO0FBQUE7QUFBQSxRQUdULGNBQWM7QUFBQSxVQUNaLFdBQVcsS0FBSyxLQUFLLFNBQVMsWUFBWTtBQUFBLFFBQzVDLENBQUM7QUFBQSxNQUFDO0FBQUEsTUFDRixNQUFNO0FBQUEsUUFDSixNQUFNO0FBQUEsUUFDTixTQUFTO0FBQUEsVUFDUCxTQUFTO0FBQUEsVUFDVCxVQUFVO0FBQUEsVUFDVixVQUFVO0FBQUEsVUFDVixXQUFXLENBQUM7QUFBQSxZQUNWLFNBQVM7QUFBQSxVQUNYLENBQUM7QUFBQSxRQUNIO0FBQUEsUUFDQSxZQUFZLENBQUMsNEJBQTRCO0FBQUEsTUFDM0M7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
