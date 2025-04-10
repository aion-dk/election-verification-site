import AxeBuilder from "@axe-core/playwright";
import { expect } from "@playwright/test";

async function analyzeAccesibility(page: any) {
  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .disableRules(["nested-interactive"])
    .analyze();

  accessibilityScanResults.violations.forEach((v) =>
    console.table({
      id: v.id,
      impact: v.impact,
      description: v.description,
      helpUrl: v.helpUrl,
      html: v.nodes[0].html,
      target: v.nodes[0].target[0],
    }),
  );

  await expect(accessibilityScanResults.violations.length).toEqual(0);
}

export default analyzeAccesibility;
