import { Analytics } from "@vercel/analytics/next";
import { AxiomWebVitals } from "next-axiom";
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
				<Analytics />
				<AxiomWebVitals />
				{children}
			</body>
		</html>
	);
}
