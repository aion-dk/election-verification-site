import { AVVerifier } from "@assemblyvoting/js-client";
import config from "./config";

export default async function useAVVerifier(slug: string) {
  const url = `${config.dbbUrl}/${slug}`;
  const avVerifier = new AVVerifier(url);
  await avVerifier.initialize();
  return avVerifier;
}
