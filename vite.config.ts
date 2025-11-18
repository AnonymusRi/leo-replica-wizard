import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0", // Required for Railway
    port: parseInt(process.env.PORT || "8080"),
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      external: [
        'pg',
        'pg-native',
        'events',
        'net',
        'util',
        'path',
        'fs',
        'tls',
        'dns',
        'crypto',
        'stream',
        'string_decoder',
      ],
    },
  },
  optimizeDeps: {
    exclude: ['pg', 'pg-native'],
  },
}));
