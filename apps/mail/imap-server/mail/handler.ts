import type { ImapSimple } from "imap-simple";
import type { FetchOptions } from "imap";
import { parseMails } from "./parser";
import * as _ from "radash";
import {
	fetchImagesToAttachment,
	parseImagesFromHtml,
} from "../attachments/scraper";
import { compressAttachments } from "../attachments/compress";
import { log } from "../util/logger";

export async function recieveUnseenMails(
	connection: ImapSimple,
	fetchOptions: FetchOptions,
	searchOptions: string[],
) {
	log.info("Trying to fetch unseen mails");

	const messages = await connection.search(searchOptions, fetchOptions);

	const mails = await parseMails(messages);

	return await _.map(mails, async (mail) => {
		const images = parseImagesFromHtml(mail);

		const attachments = await fetchImagesToAttachment(images);

		mail.attachments.push(...attachments);

		mail.attachments = await compressAttachments(mail.attachments);

		return mail;
	});
}
