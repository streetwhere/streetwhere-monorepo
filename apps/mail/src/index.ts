import imap from "imap-simple";
import type { ImapSimple, ImapSimpleOptions } from "imap-simple";
import { log } from "./util/logger";
import { recieveUnseenMails } from "./mailhandler";
import { storage } from "@streetwhere/supabase";
import { db } from "@streetwhere/drizzle";
import {
	assets as ASSETS,
	mails as MAILS,
	assets,
} from "@streetwhere/drizzle/schema";
import * as _ from "radash";

const DEFAULT_FETCH_OPTIONS = {
	bodies: ["HEADER", "TEXT", ""],
	struct: true,
	markSeen: false,
};

const DEFAULT_SEARCH_OPTIONS = ["UNSEEN"];

async function main() {
	const config: ImapSimpleOptions = {
		imap: {
			user: "mail@streetwhere.app",
			password: "4r_hYmT96/!T-",
			host: "mail.infomaniak.com",
			port: 993,
			tls: true,
			authTimeout: 3000,
		},
	};

	try {
		log.info("Connecting to IMAP-Server ...");

		const connection: ImapSimple = await imap.connect(config);

		log.info("Connection to IMAP-Server established");

		await connection.openBox("INBOX");

		connection.on("mail", async () => {
			const mails = recieveUnseenMails(
				connection,
				DEFAULT_FETCH_OPTIONS,
				DEFAULT_SEARCH_OPTIONS,
			);
		});

		const mails = await recieveUnseenMails(
			connection,
			DEFAULT_FETCH_OPTIONS,
			DEFAULT_SEARCH_OPTIONS,
		);

		for (let i = 0; i < mails.length; i++) {
			const mail = mails[i];

			if (!mail) continue;

			const { subject, to, html } = mail;

			if (!subject || !to) continue;

			const two = _.isArray(to) ? to[0] : to;

			if (!two) continue;

			await db.transaction(async (tx) => {
				const [result] = await tx
					.insert(MAILS)
					.values({
						subject: subject,
						to: two.text,
						html: html ? html : null,
					})
					.returning();

				for (const attachment of mail.attachments) {
					if (!result) continue;

					const { data, error } = await storage
						.from("attachments")
						.upload(
							`${result.id}/${attachment.filename ?? "unknown"}`,
							attachment.content,
							{
								contentType: attachment.contentType,
							},
						);

					if (error || !data) {
						log.error(error);

						tx.rollback();
						return;
					}

					await tx.insert(ASSETS).values({
						mailId: result.id,
						contentType: attachment.contentType,
						path: data.path,
						size: attachment.size,
					});
				}
			});
		}
	} catch (err) {
		console.error(err);
	}
}

main();
