import { ref, watch, onScopeDispose, type Ref } from "vue";

function base64ToBlob(base64: string, mimeType: string): Blob {
  const byteCharacters = atob(base64);
  const buffer = new ArrayBuffer(byteCharacters.length);
  const byteArray = new Uint8Array(buffer);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteArray[i] = byteCharacters.charCodeAt(i);
  }
  return new Blob([buffer], { type: mimeType });
}

export function usePdfPreview(source: Ref<string>) {
  const blobUrl = ref<string>("");

  const revoke = () => {
    if (blobUrl.value) {
      URL.revokeObjectURL(blobUrl.value);
      blobUrl.value = "";
    }
  };

  watch(
    source,
    (newBase64) => {
      revoke();
      if (newBase64) {
        const blob = base64ToBlob(newBase64, "application/pdf");
        blobUrl.value = URL.createObjectURL(blob);
      }
    },
    { immediate: true },
  );

  onScopeDispose(revoke);

  return { blobUrl };
}
