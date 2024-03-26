import "./index.css";

import {
	useQuery,
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";

export const queryClient = new QueryClient();

function Dashboard() {
	const q = useQuery({ queryKey: ["msg"], queryFn: getMessage });

	async function getMessage() {
		const res = await fetch("/api/imap/connected");

		return await res.text();
	}

	if (q.isLoading) return <p>Loading..</p>;

	return (
		<>
			<p>Nice everything works</p>

			<p className="text-green-500">{q.data}</p>
		</>
	);
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<Dashboard />
		</QueryClientProvider>
	</React.StrictMode>,
);
