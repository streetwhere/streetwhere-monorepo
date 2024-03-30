import type { Message } from "imap-simple";
import { simpleParser } from "mailparser";
import * as _ from "radash";

export async function parseMails(mails: Message[]) {
	return _.map(mails, async (mail) => {
		const part = mail.parts.filter((part) => part.which === "")[0];

		return await simpleParser(
			`Imap-Id: ${mail.attributes.uid}\r\n${part?.body}`,
			{
				keepCidLinks: true,
			},
		);
	});
}
