import { expect, test } from "vitest";
import PDFExtractor from "./PDFExtractor";

const text = `
Thankyouforvoting!VotereceiptESMA-TheEuropeanSecuritiesandMarketsAuthorityGeneralAssembly2024TwowaystotrackyourvoteScanQRcodeVisitWebsiteClickorentertheURLbelowwww.assemblyvoting.com/electionverificationsite/election/electionTrackingcodeforballottrackerGSfQy6MGenerated13June2024,09:37DBBsignature:eyJhZGRyZXNzIjoiZjJlNzY3M2FhMzIzNThkNjI1ZWE2ZWJiNzllN2NmM2E3ODg2ZDk3MmFlZWFhZGFiN2UwZjIxODllZDhlNjc0MyIsInZvdGVyX3NpZ25hdHVyZSI6ImNjYzA2NDgyYzgzYTFiYmQyMmIzNWY0ZTFjMzQ2Y2U2NTQwN2Y3ZGIwNTllNzg2ODRkNzM1YWI3ZGVlODAwNThiNzViNjMyYTI4YmFlOTY4ZTMxNDRmOCIsImRiYl9zaWduYXR1cmUiOiI2YTcwNjdjNGI0NDE2YWZlOWFlMDEyNDg4MjA5YzEwNDMxNThjY2I0N2M1MzgzMWVlN2E5OTcyZjcyNDExZjdlLDQ3MTgyNDVjNDIxNDExODBmZGIwOGViMTlkZTEwMmU3NmY5NmFiNzNiNGVhNjliZTE3MTZkMTRhMjg2ZTY0NGIifQ==
`

test("PDFExtractor#address", () => {
  const extractor = new PDFExtractor(text);
  expect(extractor.address()).toBe("f2e7673aa32358d625ea6ebb79e7cf3a7886d972aeeaadab7e0f2189ed8e6743");
});

test("PDFExtractor#voterSignature", () => {
  const extractor = new PDFExtractor(text);
  expect(extractor.voterSignature()).toBe("ccc06482c83a1bbd22b35f4e1c346ce65407f7db059e78684d735ab7dee80058b75b632a28bae968e3144f8");
});

test("PDFExtractor#dbbSignature", () => {
  const extractor = new PDFExtractor(text);
  expect(extractor.dbbSignature()).toBe("6a7067c4b4416afe9ae012488209c1043158ccb47c53831ee7a9972f72411f7e,4718245c42141180fdb08eb19de102e76f96ab73b4ea69be1716d14a286e644b");
});

test("PDFExtractor#shortAddress", () => {
  const extractor = new PDFExtractor(text);
  expect(extractor.shortAddress()).toBe("GSfQy6M");
});
