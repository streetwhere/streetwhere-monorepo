import imap from "imap-simple";
import type { ImapSimple, ImapSimpleOptions } from "imap-simple";
import { recieveUnseenMails } from "./mail/handler.js";
import * as _ from "radash";
import { startTransaction } from "./mail/upload.js";

const DEFAULT_FETCH_OPTIONS = {
	bodies: ["HEADER", "TEXT", ""],
	struct: true,
	markSeen: false,
};

const DEFAULT_SEARCH_OPTIONS = ["UNSEEN"];

export class Mailserver {
	private conn: ImapSimple | undefined;

	private connected = false;

	async connect() {
		const [err, conn] = await _.try(imap.connect)({
			imap: {
				user: "mail@streetwhere.app",
				password: "CDE*bvc-cdz5dkd_edx",
				host: "mail.infomaniak.com",
				port: 993,
				tls: true,
				authTimeout: 3000,
			},
		});

		if (err) {
			throw err;
		}

		this.conn = conn;
		this.connected = true;

		this.conn.on("close", () => {
			this.connected = false;
		});
	}

	async listen() {
		if (!this.conn) throw new Error("Connection was not established");

		this.conn.openBox("INBOX");

		this.conn.addListener("mail", async () => await this.handleMail());
	}

	async close() {
		if (!this.conn) throw new Error("Connection was not established");

		await this.conn.closeBox(false);

		this.conn.end();
	}

	isConnected() {
		return this.conn ? this.connected : false;
	}

	private async handleMail() {
		if (!this.conn) throw new Error("Connection was not established");

		const mails = await recieveUnseenMails(
			this.conn,
			DEFAULT_FETCH_OPTIONS,
			DEFAULT_SEARCH_OPTIONS,
		);

		for (const mail of mails) {
			await startTransaction(mail);
		}
	}
}
