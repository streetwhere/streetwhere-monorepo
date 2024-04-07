import { pino } from "pino";
import type { NextFunction, Request, Response } from "express";

export const log = pino({
	transport: {
		target: "pino-pretty",
	},
});

const statusEmojis: { [code: number]: string } = {
	200: "✅", // Success
	201: "✨", // Created
	304: "💾", // Cached
	400: "❌", // Bad request
	401: "🔒", // Unauthorized
	403: "⛔", // Forbidden
	404: "🔍", // Not found
	500: "💥", // Internal server error
};

export function pinoHttp() {
	return (req: Request, res: Response, next: NextFunction) => {
		const start = Date.now();

		// Define a response finish callback
		res.once("finish", () => {
			const { statusCode } = res;
			const { method, url } = req;

			const duration = Date.now() - start;
			const size = res._contentLength || res.get("content-length");
			const emoji = statusEmojis[statusCode] || "❓"; // Default emoji for unknown status codes

			const methodColor = "\x1b[35m"; // magenta
			const urlColor = "\x1b[36m"; // cyan
			const statusCodeColor =
				statusCode === 304
					? "\x1b[33m"
					: statusCode >= 400
						? "\x1b[31m"
						: "\x1b[32m"; // yellow for 304, red for error codes, green for success
			const resetColor = "\x1b[0m"; // reset color

			const logMessage = `${emoji} ${methodColor}${method}${resetColor} ==> ${urlColor}${url}${resetColor} <== ${statusCodeColor}${statusCode}${resetColor} | ${
				size ? `${size}b` : "-"
			} | ${duration}ms`;

			log.info(logMessage);
		});

		next();
	};
}
