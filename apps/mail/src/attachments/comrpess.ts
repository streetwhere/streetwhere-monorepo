import { createHash } from "crypto";
import { Attachment } from "mailparser";
import sharp from "sharp";
import { v4 } from "uuid";
import * as _ from "radash";

const CONTENT_TYPE = [
	"image/jpeg",
	"image/png",
	"image/webp",
	"image/avif",
	"image/tiff",
];

export function filterCompressableAttachments(attachments: Attachment[]) {
	return attachments.filter((attach) =>
		CONTENT_TYPE.includes(attach.contentType),
	);
}

export function isCompressableAttachment(attachment: Attachment) {
	return CONTENT_TYPE.includes(attachment.contentType);
}

export async function compressAttachments(attachments: Attachment[]) {
	return _.map(attachments, async (attach) => {
		if (!isCompressableAttachment(attach)) return attach;

		const avif = await sharp(attach.content).avif().toBuffer();

		return {
			...attach,
			filename: `${v4()}.avif`,
			contentType: "image/avif",
			content: avif,
			size: avif.byteLength,
			checksum: createHash("md5").update(avif).digest("hex"),
		};
	});
}
