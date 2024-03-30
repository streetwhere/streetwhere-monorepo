import { storage } from "@streetwhere/supabase";
import type { Attachment } from "mailparser";
import { z } from "zod";
import { TxError } from "../util/transactionError";
import type { PgTx } from "@streetwhere/drizzle";
import { schema } from "@streetwhere/drizzle";
import * as _ from "radash";
import probe from "probe-image-size";
import { log } from "imap-server/util/logger";

const { assets: ASSETS } = schema;

const BUCKET = "attachments";

export const ATTACH_SCHEMA = z.object({
	filename: z.string(),
	contentType: z.string(),
	content: z.instanceof(Buffer),
	size: z.number().nonnegative(),
	width: z.number().nonnegative().nullable(),
	height: z.number().nonnegative().nullable(),
});

export type SafeAttachment = z.output<typeof ATTACH_SCHEMA>;

const getPath = (id: number, filename: string) => `${id}/${filename}`;

export function isAttachmentValid(attach: Attachment): SafeAttachment {
	if (!attach) throw new TxError("Attachment is not defined");

	const { width, height } = probe.sync(attach.content) ?? {
		width: null,
		height: null,
	};

	return ATTACH_SCHEMA.parse({ ...attach, width, height });
}

export async function uploadToBucket(
	attach: SafeAttachment,
	id: number,
): Promise<string> {
	const { error, data } = await storage
		.from(BUCKET)
		.upload(getPath(id, attach.filename), attach.content, {
			contentType: attach.contentType,
		});

	if (error) throw new TxError(error.message);

	log.info(data, "path");

	return data.path;
}

export async function uploadToDatabase(
	tx: PgTx,
	attach: SafeAttachment,
	path: string,
	id: number,
): Promise<void> {
	await tx.insert(ASSETS).values({
		mailId: id,
		contentType: attach.contentType,
		path: path,
		size: attach.size,
		width: attach.width,
		height: attach.height,
	});
}

export async function rollbackBucket(paths: string[]) {
	return await _.try(storage.from(BUCKET).remove)(paths);
}
