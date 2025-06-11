import { AVClient } from "@assemblyvoting/js-client";
import { ref } from "vue";
import config from "./config";

const avClient = ref<AVClient | null>(null);

export default async function useAVClient(slug: string) {
  const url = `${config.dbbUrl}/${slug}`;
  avClient.value = new AVClient(url);
  await avClient.value.initialize();

  return avClient;
}
