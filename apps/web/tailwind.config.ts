import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
	content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
	theme: {
		fontFamily: { sans: ["var(--font-onest)", ...fontFamily.sans] },

		extend: {},
	},
	plugins: [],
} satisfies Config;
