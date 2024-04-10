import { db, schema } from "@streetwhere/drizzle";

const { mails } = schema;

export default async function Home() {
	const res = await db.select().from(mails);

	return (
		<main className="divide-y">
			{res.map((item) => (
				<p className="p-2 text-center" key={item.id}>
					{item.subject}
				</p>
			))}
		</main>
	);
}
