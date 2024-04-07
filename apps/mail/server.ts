import { db, schema } from "@streetwhere/drizzle";
import express, { Router } from "express";
import { engine } from "express-handlebars";
import { Mailserver } from "imap-server";
import { pinoHttp } from "util/logger";

const DEV = (process.env.NODE_ENV || "development") === "development";
const PORT = process.env.PORT || 3001;

const { mails: MAILS } = schema;

try {
	const app = express();
	const imap = new Mailserver();

	// Logger (Morgan)
	app.use(pinoHttp());

	// Handlebars
	app.engine("handlebars", engine());
	app.set("view engine", "handlebars");
	app.set("views", `${__dirname}/views`);

	// TEMPLATES RENDER
	app.get("/", (_, res) => {
		res.render("index");
	});

	const api = Router();

	// IMAP
	api.get("/imap/connected", (_, res) => {
		res.json(imap.isConnected());
	});

	// MAILS
	api.get("/mail/list", async (_, res) => {
		const mails = await db.select().from(MAILS);

		res.render("components/maillist", { layout: false, mails });
	});

	app.use("/api", api);

	const server = app.listen(PORT, async () => {
		await imap.connect();

		await imap.listen();
	});

	process.on("SIGINT", async () => {
		await imap.close();

		server.close();

		process.exit(0);
	});
} catch (error) {}
