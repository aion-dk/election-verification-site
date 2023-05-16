import { AVVerifier } from "@aion-dk/js-client";
import config from "./config";

export default async function useAVVerifier(slug: string) {
  const url = `${config.dbbUrl}/${slug}`;
  const avVerifier = await new AVVerifier(url);
  await avVerifier.initialize();
  return avVerifier;
}
