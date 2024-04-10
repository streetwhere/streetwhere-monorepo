import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: ["/m/"],
			},
			{
				userAgent: [
					"Mail.Ru",
					"360Spider",
					"360Spider-Image",
					"360Spider-Video",
					"Daumoa",
					"gooblog",
					"HaoSouSpider",
					"ichiro",
					"JikeSpider",
					"Rambler",
					"Sosospider",
					"Sogou blog",
					"Sogou inst spider",
					"Sogou news Spider",
					"Sogou Orion spider",
					"Sogou spider2",
					"Sogou web spider",
					"SputnikBot",
					"Yandex",
					"YandexMobileBot",
					"Yeti",
					"YoudaoBot",
				],
				disallow: "/",
			},
		],
		sitemap: "https://streetwhere.app/sitemap.xml",
	};
}
