import { db } from "@streetwhere/drizzle";
import { mails } from "@streetwhere/drizzle/schema";

export async function POST(request: Request) {
	const { formData, headers } = request;

	const to = headers.get("to");
	const subject = headers.get("subject");

	console.log("to: ", to);
	console.log("subject: ", subject);

	return new Response("success");
}
