"use client";

import { Button } from "@/components/ui/button";
import { DownloadIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
	const [event, setEvent] = useState<Event>();

	useEffect(() => {
		window.addEventListener("beforeinstallprompt", (e) => {
			console.error(e);
			e.preventDefault();

			setEvent(e);
		});
	});

	return (
		<div className="flex flex-col min-h-screen justify-between p-4">
			<header className="flex justify-between items-center">
				<Image
					src="/icon/64"
					alt="logo"
					width={64}
					height={64}
					className="w-12 h-12"
				/>

				<Button
					onClick={() => {
						if (event !== undefined) {
							event.prompt();

							event.userChoice.then((choiceResult) => {
								if (choiceResult.outcome === "accepted") {
									console.log("App installed");
								} else {
									console.log("App installation declined");
								}
							});
						}
					}}
					className="justify-self-end"
				>
					<DownloadIcon className="mr-2 h-4 w-4" />
					Download App
				</Button>
			</header>
			<main className="grow flex justify-center items-center">
				<div className="flex flex-col">
					<span className="text-5xl font-bold">streetwhere?</span>
					<div className="flex gap-2 text-xl">more coming soon ... </div>
				</div>
			</main>
			<footer className="opacity-40 italic text-center text-sm">
				@copyrights 2024 streetwhere
			</footer>
		</div>
	);
}
