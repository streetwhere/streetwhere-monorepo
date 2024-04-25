import { Analytics } from "@vercel/analytics/next";
import { AxiomWebVitals } from "next-axiom";
import Script from 'next/script'
import "./globals.css";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<title>Streetwhere?</title>
			</head>
			<body>
				<Script src="https://analytics.eu.umami.is/script.js" data-website-id="febee53c-a9d6-4bb1-9e20-94780dc827bc" />
				<Analytics />
				<AxiomWebVitals />
				{children}
			</body>
		</html>
	);
}
