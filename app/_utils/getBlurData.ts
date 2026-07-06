import { getPlaiceholder } from "plaiceholder";

export async function getBlurData(src: string) {
	try {
		const buffer = await fetch(src).then(async (res) =>
			Buffer.from(await res.arrayBuffer()),
		);

		const { base64 } = await getPlaiceholder(buffer);
		return base64;
	} catch (error) {
		console.error("Failed to generate blur placeholder:", error);
		return "";
	}
}
