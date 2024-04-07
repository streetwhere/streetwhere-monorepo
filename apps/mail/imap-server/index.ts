import imap from "imap-simple";
import type { ImapSimple } from "imap-simple";
import { recieveUnseenMails } from "./mail/handler";
import * as _ from "radash";
import { startTransaction } from "./mail/upload";
import { log } from "../util/logger";

const DEFAULT_FETCH_OPTIONS = {
	bodies: ["HEADER", "TEXT", ""],
	struct: true,
	markSeen: true,
};

const DEFAULT_SEARCH_OPTIONS = ["UNSEEN"];

const password = process.env.SMTP_MAIL_PASSWORD;

if (!password) throw new Error("SMTP Password not defined");

export class Mailserver {
	private conn: ImapSimple | undefined;

	private connected = false;

	async connect() {
		log.info("Trying to connect to IMAP server");

		const [err, conn] = await _.try(imap.connect)({
			imap: {
				user: "mail@streetwhere.app",
				password: password,
				host: "mail.infomaniak.com",
				port: 993,
				tls: true,
				authTimeout: 3000,
			},
		});

		if (err) {
			log.fatal(err, "Couldn't connect to IMAP server", "King");
			throw err;
		}

		conn.openBox("INBOX");

		log.info("Connected to IMAP server successfully");

		this.conn = conn;
		this.connected = true;

		this.conn.on("close", () => {
			log.info("Connection to IMAP server closed");
			this.connected = false;
			return;
		});
	}

	async listen() {
		if (!this.conn) throw this.#noConnection();

		this.conn.addListener("mail", () => this.handleMail());
	}

	async close() {
		if (!this.conn) throw this.#noConnection();

		log.info("Trying to close connection to IMAP server");

		this.conn.end();
	}

	isConnected() {
		return this.conn ? this.connected : false;
	}

	private async handleMail() {
		if (!this.conn) throw this.#noConnection();

		const mails = await recieveUnseenMails(
			this.conn,
			DEFAULT_FETCH_OPTIONS,
			DEFAULT_SEARCH_OPTIONS,
		);

		if (mails.length === 0) return;

		log.info(`Uploading ${mails.length} mails to database and bucket`);

		for (const mail of mails) {
			await startTransaction(mail);
		}
	}

	#noConnection(): Error {
		const err = new Error("this.conn is undefined");

		log.fatal(err, "Connection was not established");

		return err;
	}
}
