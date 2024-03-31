import { Analytics } from "@vercel/analytics/next";
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
				{children}
				<Analytics />
			</body>
		</html>
	);
}
