import { defineConfig } from "vite";
import { vite as million } from "million/compiler";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [million({ auto: true }), react(), tailwindcss()],
});
