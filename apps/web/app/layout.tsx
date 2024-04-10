import { Analytics } from "@vercel/analytics/next";
import { AxiomWebVitals } from "next-axiom";
import { Onest } from "next/font/google";

import type { Metadata, Viewport } from "next";

import "./globals.css";

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "white" },
		{ media: "(prefers-color-scheme: dark)", color: "black" },
	],
};

const APP_NAME = "streetwhere?";
const APP_DEFAULT_TITLE =
	"streetwhere? - Find streetbrands all around the world and stay notified when thy drop clothes.";
const APP_TITLE_TEMPLATE = "%s - streetwhere?";
const APP_DESCRIPTION =
	"streetwhere? is a online streetbrand hub that helps you manage different clothing drops and releases from a central place. With the help of notification you will never miss a drop on Streetwhere.";

export const metadata: Metadata = {
	generator: "Next.js",
	applicationName: APP_NAME,

	title: {
		default: APP_DEFAULT_TITLE,
		template: APP_TITLE_TEMPLATE,
	},

	description: APP_DESCRIPTION,

	referrer: "origin-when-cross-origin",
	keywords: [
		"Streetwear",
		"Fashion",
		"Notification Manager",
		"Notification Hub",
		"Streetbrands",
	],
	authors: [{ name: "Gabriel Egli", url: "https://gabriel-egli.ch" }],
	creator: "Gabriel Egli",
	publisher: "Gabriel Egli",

	formatDetection: {
		email: true,
		address: true,
		telephone: true,
	},

	appleWebApp: {
		capable: true,
		statusBarStyle: "black-translucent",
		title: APP_DEFAULT_TITLE,
	},

	openGraph: {
		type: "website",
		siteName: APP_NAME,
		title: {
			default: APP_DEFAULT_TITLE,
			template: APP_TITLE_TEMPLATE,
		},
		description: APP_DESCRIPTION,
	},

	twitter: {
		card: "summary",
		title: {
			default: APP_DEFAULT_TITLE,
			template: APP_TITLE_TEMPLATE,
		},
		description: APP_DESCRIPTION,
	},

	manifest: "/manifest.json",
};

const onest = Onest({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-onest",
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={onest.variable}>
			<body>
				<Analytics />
				<AxiomWebVitals />
				{children}
			</body>
		</html>
	);
}
