import "../../test-utils/setupConfig";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { defineComponent, h, ref, nextTick } from "vue";
import { mount } from "@vue/test-utils";
import { usePdfPreview } from "../usePdfPreview";

const VALID_BASE64 = btoa("%PDF-1.4 fake pdf content");

describe("usePdfPreview", () => {
  let createObjectURLSpy: ReturnType<typeof vi.spyOn>;
  let revokeObjectURLSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    createObjectURLSpy = vi
      .spyOn(URL, "createObjectURL")
      .mockReturnValue("blob:fake-url");
    revokeObjectURLSpy = vi
      .spyOn(URL, "revokeObjectURL")
      .mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("creates a blob URL from a base64 string", async () => {
    const source = ref(VALID_BASE64);
    const TestComponent = defineComponent({
      setup() {
        const { blobUrl } = usePdfPreview(source);
        return { blobUrl };
      },
      render() {
        return h("div", this.blobUrl);
      },
    });

    const wrapper = mount(TestComponent);
    await nextTick();

    expect(createObjectURLSpy).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.blobUrl).toBe("blob:fake-url");
    wrapper.unmount();
  });

  it("revokes the previous URL when the source changes", async () => {
    const source = ref(VALID_BASE64);
    const TestComponent = defineComponent({
      setup() {
        const { blobUrl } = usePdfPreview(source);
        return { blobUrl };
      },
      render() {
        return h("div");
      },
    });

    const wrapper = mount(TestComponent);
    await nextTick();

    expect(createObjectURLSpy).toHaveBeenCalledTimes(1);

    source.value = btoa("%PDF-1.4 different content");
    await nextTick();

    expect(revokeObjectURLSpy).toHaveBeenCalledWith("blob:fake-url");
    expect(createObjectURLSpy).toHaveBeenCalledTimes(2);
    wrapper.unmount();
  });

  it("revokes the URL when the component is unmounted", async () => {
    const source = ref(VALID_BASE64);
    const TestComponent = defineComponent({
      setup() {
        const { blobUrl } = usePdfPreview(source);
        return { blobUrl };
      },
      render() {
        return h("div");
      },
    });

    const wrapper = mount(TestComponent);
    await nextTick();

    wrapper.unmount();

    expect(revokeObjectURLSpy).toHaveBeenCalledWith("blob:fake-url");
  });

  it("does not create a URL when source is empty", async () => {
    const source = ref("");
    const TestComponent = defineComponent({
      setup() {
        const { blobUrl } = usePdfPreview(source);
        return { blobUrl };
      },
      render() {
        return h("div");
      },
    });

    const wrapper = mount(TestComponent);
    await nextTick();

    expect(createObjectURLSpy).not.toHaveBeenCalled();
    expect(wrapper.vm.blobUrl).toBe("");
    wrapper.unmount();
  });
});
