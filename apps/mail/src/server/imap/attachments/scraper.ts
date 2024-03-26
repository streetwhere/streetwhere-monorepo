import { load } from "cheerio";
import type { Attachment, ParsedMail } from "mailparser";
import * as _ from "radash";

const BLACKLIST = ["trk.klclick.com", "trk.klclick1.com"];

export function parseImagesFromHtml(mail: ParsedMail): string[] {
	if (!mail.html) return [];

	const $ = load(mail.html);

	const filter = (images: string[]) =>
		images.filter((img) => !BLACKLIST.includes(extractDomain(img) ?? ""));
	const unique = (images: string[]) => _.unique(images, (img) => img);

	const chained = _.chain(filter, unique);

	const imagesSrc = $("img")
		.map((i, e) => $(e).attr("src"))
		.toArray() as unknown as string[];

	// TODO: Replace src name in html markup
	return chained(imagesSrc);
}

export async function fetchImagesToAttachment(
	images: string[],
): Promise<Attachment[]> {
	return _.sift(
		await _.map(images, async (image) => {
			let buffer: Buffer | undefined;
			let contentType: string | undefined;

			if (isImageBase64(image)) {
				const data = getImageFromBase64(image);

				buffer = data.buffer;
				contentType = data.contentType;
			}

			if (await isImageUrl(image)) {
				const data = await getImageFromUrl(image);

				buffer = data.buffer;
				contentType = data.contentType;
			}

			return {
				type: "attachment",
				content: buffer ?? Buffer.from(""),
				contentType: contentType ?? "",
				contentDisposition: "inline",
				filename: "",
				checksum: "",
				size: buffer ? buffer.byteLength : 0,
				related: true,
				headerLines: [],
				headers: new Map(),
			};
		}),
	);
}

// BASE64

const BASE64_REGEX = /^[-A-Za-z0-9+/]*={0,3}$/;

function isImageBase64(image: string): boolean {
	const base64Data = image.split(",")[1];

	return base64Data !== undefined && BASE64_REGEX.test(base64Data);
}

function getImageFromBase64(image: string) {
	const [meta, base64Data] = image.split(",");

	if (!meta || !base64Data) return {};

	return {
		buffer: Buffer.from(base64Data, "base64"),
		contentType: cleanContentTypeBase64(meta),
	};
}

function cleanContentTypeBase64(meta: string) {
	return meta.replace("data:", "").replace(";base64", "");
}

// URL

const URL_REGEX = /\.(gif|jpe?g|tiff?|png|webp|bmp|avif)$/;

async function isImageUrl(image: string): Promise<boolean> {
	if (!URL_REGEX.test(image)) return false;

	const contentType = (await fetch(image, { method: "HEAD" })).headers.get(
		"Content-Type",
	);

	return contentType ? contentType.startsWith("image/") : false;
}

async function getImageFromUrl(image: string) {
	const [err, res] = await _.tryit(fetch)(image);

	if (err || !res) return {};

	return {
		buffer: Buffer.from(await res.arrayBuffer()),
		contentType: res.headers.get("Content-Type") ?? "image/undefined",
	};
}

// BLACKLIST

const DOMAIN_REGEX = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:/\n?]+).*$/i;

function extractDomain(url: string) {
	const match = url.match(DOMAIN_REGEX);

	return match ? match[1] : null;
}
