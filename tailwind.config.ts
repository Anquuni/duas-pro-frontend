import { fontFamily } from "tailwindcss/defaultTheme";
import type { Config } from "tailwindcss";

const config: Config = {
	darkMode: ["class"],
	content: [
		"./src/**/*.{html,js,svelte,ts}",
		'./src/lib/components/**/*.{html,js,svelte,ts}'
	],
	safelist: ["dark"],
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px"
			}
		},
		extend: {
			colors: {
				border: "hsl(var(--border) / <alpha-value>)",
				input: "hsl(var(--input) / <alpha-value>)",
				ring: "hsl(var(--ring) / <alpha-value>)",
				background: "hsl(var(--background) / <alpha-value>)",
				foreground: "hsl(var(--foreground) / <alpha-value>)",
				primary: {
					DEFAULT: "hsl(var(--primary) / <alpha-value>)",
					foreground: "hsl(var(--primary-foreground) / <alpha-value>)"
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
					foreground: "hsl(var(--secondary-foreground) / <alpha-value>)"
				},
				tertiary: {
					DEFAULT: "hsl(var(--tertiary) / <alpha-value>)",
					foreground: "hsl(var(--tertiary-foreground) / <alpha-value>)"
				},
				// primary: {
				// 	50: '#f0fdf4',
				// 	100: '#dcfce7',
				// 	200: '#bbf7d0',
				// 	300: '#86efac',
				// 	400: '#4ade80',
				// 	500: '#027435',  // base color
				// 	600: '#026830',
				// 	700: '#025828',
				// 	800: '#014b22',
				// 	900: '#013d1b',
				// 	950: '#002811'
				// },
				// secondary: {
				// 	50: '#fdf2f6',
				// 	100: '#fce7ee',
				// 	200: '#fac5d8',
				// 	300: '#f59eb9',
				// 	400: '#ed6894',
				// 	500: '#740240',  // base-color
				// 	600: '#68023a',
				// 	700: '#570231',
				// 	800: '#490229',
				// 	900: '#3d021e',
				// 	950: '#2b0116'
				// },
				destructive: {
					DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
					foreground: "hsl(var(--destructive-foreground) / <alpha-value>)"
				},
				muted: {
					DEFAULT: "hsl(var(--muted) / <alpha-value>)",
					foreground: "hsl(var(--muted-foreground) / <alpha-value>)"
				},
				accent: {
					DEFAULT: "hsl(var(--accent) / <alpha-value>)",
					foreground: "hsl(var(--accent-foreground) / <alpha-value>)"
				},
				popover: {
					DEFAULT: "hsl(var(--popover) / <alpha-value>)",
					foreground: "hsl(var(--popover-foreground) / <alpha-value>)"
				},
				card: {
					DEFAULT: "hsl(var(--card) / <alpha-value>)",
					foreground: "hsl(var(--card-foreground) / <alpha-value>)"
				}
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)"
			},
			fontFamily: {
				sans: [...fontFamily.sans]
			}
		}
	},
};

export default config;
