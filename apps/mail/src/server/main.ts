import express from "express";
import ViteExpress from "vite-express";
import { Mailserver } from "./imap/index.ts";
import { api } from "./api/index.ts";

const app = express();
export const imap = new Mailserver();

ViteExpress.config({
	ignorePaths: /^\/(?!assets\/.+).+/g,
});

app.use("/api", api);

app.all(/^\/(?!assets\/.+).+/g, (_, res) => {
	res.sendStatus(404);
});

const http = ViteExpress.listen(app, 3001, () => {
	console.log("Server is listening on port 3000...");

	imap.connect();
});

http.on("vite:close", async () => {
	await imap.close();
	http.close();
});
