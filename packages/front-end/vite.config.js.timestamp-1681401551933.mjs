// vite.config.js
import { defineConfig } from "file:///home/shadowfish/git/FlexiBook/node_modules/.pnpm/vite@3.2.5_less@4.1.3/node_modules/vite/dist/node/index.js";
import react from "file:///home/shadowfish/git/FlexiBook/node_modules/.pnpm/@vitejs+plugin-react@2.2.0_vite@3.2.5/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { vitePluginForArco } from "file:///home/shadowfish/git/FlexiBook/node_modules/.pnpm/@arco-plugins+vite-react@1.3.3/node_modules/@arco-plugins/vite-react/lib/index.js";
var vite_config_default = defineConfig({
  build: {
    sourcemap: true
  },
  plugins: [
    react({
      babel: {
        presets: ["@babel/preset-typescript"],
        plugins: [
          "@babel/plugin-transform-typescript",
          [
            "babel-plugin-styled-components",
            {
              ssr: false,
              displayName: true,
              fileName: true
            }
          ]
        ]
      }
    }),
    vitePluginForArco()
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9zaGFkb3dmaXNoL2dpdC9GbGV4aUJvb2svcGFja2FnZXMvZnJvbnQtZW5kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9zaGFkb3dmaXNoL2dpdC9GbGV4aUJvb2svcGFja2FnZXMvZnJvbnQtZW5kL3ZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3NoYWRvd2Zpc2gvZ2l0L0ZsZXhpQm9vay9wYWNrYWdlcy9mcm9udC1lbmQvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xuaW1wb3J0IHsgdml0ZVBsdWdpbkZvckFyY28gfSBmcm9tIFwiQGFyY28tcGx1Z2lucy92aXRlLXJlYWN0XCI7XG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgYnVpbGQ6IHtcbiAgICBzb3VyY2VtYXA6IHRydWUsXG4gIH0sXG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCh7XG4gICAgICBiYWJlbDoge1xuICAgICAgICBwcmVzZXRzOiBbXCJAYmFiZWwvcHJlc2V0LXR5cGVzY3JpcHRcIl0sXG4gICAgICAgIHBsdWdpbnM6IFtcbiAgICAgICAgICBcIkBiYWJlbC9wbHVnaW4tdHJhbnNmb3JtLXR5cGVzY3JpcHRcIixcbiAgICAgICAgICBbXG4gICAgICAgICAgICBcImJhYmVsLXBsdWdpbi1zdHlsZWQtY29tcG9uZW50c1wiLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBzc3I6IGZhbHNlLFxuICAgICAgICAgICAgICBkaXNwbGF5TmFtZTogdHJ1ZSxcbiAgICAgICAgICAgICAgZmlsZU5hbWU6IHRydWUsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pLFxuICAgIHZpdGVQbHVnaW5Gb3JBcmNvKCksXG4gIF0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBcVUsU0FBUyxvQkFBb0I7QUFDbFcsT0FBTyxXQUFXO0FBQ2xCLFNBQVMseUJBQXlCO0FBRWxDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLE9BQU87QUFBQSxJQUNMLFdBQVc7QUFBQSxFQUNiO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsTUFDSixPQUFPO0FBQUEsUUFDTCxTQUFTLENBQUMsMEJBQTBCO0FBQUEsUUFDcEMsU0FBUztBQUFBLFVBQ1A7QUFBQSxVQUNBO0FBQUEsWUFDRTtBQUFBLFlBQ0E7QUFBQSxjQUNFLEtBQUs7QUFBQSxjQUNMLGFBQWE7QUFBQSxjQUNiLFVBQVU7QUFBQSxZQUNaO0FBQUEsVUFDRjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRixDQUFDO0FBQUEsSUFDRCxrQkFBa0I7QUFBQSxFQUNwQjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
