import { db } from "@streetwhere/drizzle";
import * as _ from "radash";
import type { PgTx } from "@streetwhere/drizzle";
import type { ParsedMail } from "mailparser";
import { schema } from "@streetwhere/drizzle";
import { TxError } from "../../util/transactionError";
import { z } from "zod";
import {
	isAttachmentValid,
	rollbackBucket,
	uploadToBucket,
	uploadToDatabase,
} from "../attachments/upload";
import { log } from "../../util/logger";

const { mails: MAILS } = schema;

const ADDRESS_SCHEMA = z.object({
	value: z
		.array(z.object({ name: z.string(), address: z.string() }))
		.nonempty(),
	html: z.string(),
	text: z.string(),
});

const ADDRESS_UNION_SCHEMA = z.union([
	ADDRESS_SCHEMA,
	z.array(ADDRESS_SCHEMA).nonempty(),
]);

const MAIL_SCHEMA = z
	.object({
		subject: z.string(),
		to: ADDRESS_UNION_SCHEMA,
		html: z.string(),
		text: z.string(),
	})
	.readonly();

export type SafeParsedMail = z.output<typeof MAIL_SCHEMA>;
export type SafeParsedMailAddress = z.output<typeof ADDRESS_SCHEMA>;
export type SafeParsedMailAddressUnion = z.output<typeof ADDRESS_UNION_SCHEMA>;

export async function startTransaction(mail: ParsedMail) {
	return db.transaction(async (tx) => {
		const uploadedAttachments: string[] = [];

		try {
			const safeMail = isValidMail(mail);

			const id = await createMail(tx, safeMail);

			for (const attach of mail.attachments) {
				const safeAttach = isAttachmentValid(attach);

				const path = await uploadToBucket(safeAttach, id);

				uploadedAttachments.push(path);

				await uploadToDatabase(tx, safeAttach, path, id);
			}
		} catch (error) {
			log.error(error, "Error occured while uploading mail");

			if (uploadedAttachments.length > 0) {
				const [err] = await rollbackBucket(uploadedAttachments);

				if (err)
					log.error(
						{ paths: uploadedAttachments, err },
						"Couldn't rollback attachments",
					);
			}

			tx.rollback();
		}
	});
}

function isValidMail(mail: ParsedMail | undefined): SafeParsedMail {
	if (!mail) throw new TxError("Mail is not defined");

	return MAIL_SCHEMA.parse(mail);
}

function getAddress(to: SafeParsedMailAddressUnion): string {
	if (!_.isArray(to)) return to.value[0].address;

	return to[0].value[0].address;
}

async function createMail(tx: PgTx, mail: SafeParsedMail) {
	const { subject, html, text: plain, to } = mail;
	const input = { subject, html, plain, to: getAddress(to) };
	const res = await tx.insert(MAILS).values(input).returning({ id: MAILS.id });

	return z.number().parse(res[0]?.id);
}
