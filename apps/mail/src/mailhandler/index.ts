import type { ImapSimple } from "imap-simple";
import type { FetchOptions } from "imap";
import { parseMails } from "~/mailparser";
import * as _ from "radash";
import {
	fetchImagesToAttachment,
	parseImagesFromHtml,
} from "~/attachments/scraper";
import { compressAttachments } from "~/attachments/comrpess";

export async function recieveUnseenMails(
	connection: ImapSimple,
	fetchOptions: FetchOptions,
	searchOptions: string[],
) {
	const messages = await connection.search(searchOptions, fetchOptions);

	let mails = await parseMails(messages);

	mails = await _.map(mails, async (mail) => {
		const images = parseImagesFromHtml(mail);

		const attachments = await fetchImagesToAttachment(images);

		mail.attachments.push(...attachments);

		mail.attachments = await compressAttachments(mail.attachments);

		return mail;
	});

	return mails;
}
