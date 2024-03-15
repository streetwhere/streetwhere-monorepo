import pino from "pino";

export const log = pino({
	transport: {
		targets: [
			{
				level: "trace",
				target: "pino-pretty",
				options: {},
			},
		],
	},
});
