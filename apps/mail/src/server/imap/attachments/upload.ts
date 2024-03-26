import { storage } from "@streetwhere/supabase";
import type { Attachment } from "mailparser";
import { z } from "zod";
import { TxError } from "../util/transactionError.js";
import type { PgTx } from "@streetwhere/drizzle";
import { assets as ASSETS } from "@streetwhere/drizzle/schema";
import * as _ from "radash";

const BUCKET = "attachments";

export const ATTACH_SCHEMA = z.object({
	filename: z.string(),
	contentType: z.string(),
	content: z.instanceof(Buffer),
	size: z.number().nonnegative(),
});

export type SafeAttachment = z.output<typeof ATTACH_SCHEMA>;

const getPath = (id: number, filename: string) => `${id}/${filename}`;

export function isAttachmentValid(attach: Attachment): SafeAttachment {
	if (!attach) throw new TxError("Attachment is not defined");

	return ATTACH_SCHEMA.parse(attach);
}

export async function uploadToBucket(
	attach: SafeAttachment,
	id: number,
): Promise<string> {
	const { error, data } = await storage
		.from(BUCKET)
		.upload(getPath(id, attach.filename), attach.content);

	if (error) throw new TxError(error.message);

	return data.path;
}

export async function uploadToDatabase(
	tx: PgTx,
	attach: SafeAttachment,
	path: string,
	id: number,
) {
	const insert = tx.insert(ASSETS).values({
		mailId: id,
		contentType: attach.contentType,
		path: path,
		size: attach.size,
	}).returning;

	const [err, res] = await _.try(insert)({});

	if (err || !res) throw new TxError(err.message);
}
