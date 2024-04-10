import { ImageResponse } from "next/og";

export const runtime = "edge";

export function generateImageMetadata() {
	return [
		// Favicon
		{
			contentType: "image/png",
			size: { width: 16, height: 16 },
			id: "16",
		},
		{
			contentType: "image/png",
			size: { width: 180, height: 180 },
			id: "180",
		},
		{
			contentType: "image/png",
			size: { width: 192, height: 192 },
			id: "192",
		},
		// Chrome Webstore (Manifest)
		{
			contentType: "image/png",
			size: { width: 128, height: 128 },
			id: "128",
		},
		{
			contentType: "image/png",
			size: { width: 256, height: 256 },
			id: "256",
		},
	];
}

interface IconProps {
	id: string;
}

export default function Icon(props: IconProps) {
	const size = Number(props.id);

	return new ImageResponse(
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				width: "100%",
				height: "100%",
				backgroundColor: "#111",
			}}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="75%"
				height="75%"
				role="img"
				aria-label="icon"
				viewBox="0 0 48 48"
				fill="none"
			>
				<g clip-path="url(#clip0_144_37)">
					<mask
						id="mask0_144_37"
						maskUnits="userSpaceOnUse"
						x="0"
						y="0"
						width="48"
						height="48"
					>
						<path
							d="M0 48V0H48V48H0ZM31.3648 44.2728C32.3792 44.2728 33.4037 44.0985 34.3697 43.7688L35.0289 44.4268C35.7493 45.1485 36.7089 45.5455 37.7284 45.5455C38.7478 45.5455 39.7074 45.1485 40.4278 44.4268C41.9168 42.939 41.9168 40.5158 40.4278 39.028L39.7685 38.3687C40.0994 37.4015 40.2738 36.377 40.2738 35.3639C40.2738 30.3685 36.3602 26.4549 31.3648 26.4549C26.3694 26.4549 22.4559 30.3685 22.4559 35.3639C22.4559 40.3593 26.3694 44.2728 31.3648 44.2728Z"
							fill="white"
						/>
					</mask>
					<g mask="url(#mask0_144_37)">
						<path
							d="M24.0002 10.0001C20.0001 10.0001 18.0001 6.00006 18.0001 6.00006H16.7701C14.9581 6.00006 13.1781 6.49206 11.6241 7.42607L5.20803 11.2741C4.48402 11.7101 4.11002 12.5541 4.27602 13.3821L5.67803 20.3922C5.86603 21.3282 6.68604 22.0002 7.64005 22.0002H10.0001V38.0003C10.0001 40.2103 11.7901 42.0003 14.0001 42.0003H34.0002C36.2102 42.0003 38.0003 40.2103 38.0003 38.0003V22.0002H40.3603C41.3143 22.0002 42.1343 21.3282 42.3223 20.3922L43.7243 13.3821C43.8903 12.5541 43.5163 11.7101 42.7923 11.2741L36.3763 7.42407C34.8202 6.49206 33.0422 6.00006 31.2302 6.00006H30.0002C30.0002 6.00006 28.0002 10.0001 24.0002 10.0001Z"
							fill="#F0F8FF"
						/>
					</g>
					<path
						d="M38.627 40.8276L36.7154 38.916C37.348 37.8991 37.7272 36.6315 37.7272 35.3639C37.7272 31.8003 34.9273 29.0004 31.3637 29.0004C27.8001 29.0004 25.0002 31.8003 25.0002 35.3639C25.0002 38.9275 27.8001 41.7274 31.3637 41.7274C32.6313 41.7274 33.8989 41.3482 34.9158 40.7156L36.8274 42.6272C37.0756 42.8754 37.4014 43.0001 37.7272 43.0001C38.0531 43.0001 38.3789 42.8754 38.627 42.6272C39.1247 42.1296 39.1247 41.3253 38.627 40.8276ZM27.5456 35.3639C27.5456 33.2003 29.2001 31.5458 31.3637 31.5458C33.5273 31.5458 35.1818 33.2003 35.1818 35.3639C35.1818 37.5275 33.5273 39.182 31.3637 39.182C29.2001 39.182 27.5456 37.5275 27.5456 35.3639Z"
						fill="#F0F8FF"
					/>
				</g>
				<defs>
					<clipPath id="clip0_144_37">
						<rect width="48" height="48" fill="white" />
					</clipPath>
				</defs>
			</svg>
		</div>,
		{ height: size, width: size },
	);
}
