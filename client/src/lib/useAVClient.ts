import { AVClient } from "@aion-dk/js-client";
import config from "./config";

export default async function useAVClient(slug: string) {
  const url = `${config.dbbUrl}/${slug}`;
  const avClient = await new AVClient(url);
  await avClient.initialize();
  await avClient.getLatestConfig();
  return avClient;
}
