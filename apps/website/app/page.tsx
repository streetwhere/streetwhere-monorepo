import { db } from "@streetwhere/drizzle";
import { mails } from "@streetwhere/drizzle/schema";

export default async function Home() {
	const res = await db.select().from(mails);

	return (
		<main className="">
			<p>{JSON.stringify(res)}</p>
		</main>
	);
}
