import { db, schema } from "@streetwhere/drizzle";

const { mails } = schema;

export default async function Home() {
	const res = await db.select().from(mails);

	return (
		<main>
			{res.map((item) => (
				<p key={item.id}>{item.subject}</p>
			))}
		</main>
	);
}
