import "../test-utils/setupConfig";
import { test, expect, vi, beforeEach, afterEach } from "vitest";
import { axe } from "vitest-axe";
import ResultCard from "./ResultCard.vue";
import { mountForA11y } from "../test-utils/a11y";
import type { PublishedResult } from "@/Types";

vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:fake-url");
vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});

const mockResult: PublishedResult = {
  votingRoundName: "Round 1 - General Election",
  votingRoundClosingDate: "2025-01-15T00:00:00.000Z",
  publishedAt: "2025-01-20T10:30:00.000Z",
  pdf: btoa("%PDF-1.4 fake pdf content"),
};

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.clearAllMocks();
});

test("ResultCard has no accessibility violations", async () => {
  const wrapper = await mountForA11y(ResultCard, {
    props: { result: mockResult },
  });
  const results = await axe(wrapper.element);
  await expect(results).toHaveNoViolations();
  wrapper.unmount();
});
