import { describe, it, expect } from "vitest";
import { PDFDict, PDFDocument, PDFHexString, PDFName } from "pdf-lib";
import { ReceiptPDFExtractor } from "./receiptPDFExtractor";

async function buildReceiptFile(entries: Record<string, string>) {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.addPage();
  const infoDict = pdfDoc.context.lookup(
    pdfDoc.context.trailerInfo.Info,
  ) as PDFDict;
  Object.entries(entries).forEach(([key, value]) =>
    infoDict.set(PDFName.of(key), PDFHexString.fromText(value)),
  );
  const bytes = await pdfDoc.save();
  return new File([bytes as BlobPart], "receipt.pdf", {
    type: "application/pdf",
  });
}

describe("ReceiptPDFExtractor", () => {
  it("extracts the receipt and ballot code", async () => {
    const file = await buildReceiptFile({
      Receipt: "receipt-data",
      BallotCode: "ballot-123",
    });
    const extractor = new ReceiptPDFExtractor(file);

    await extractor.extract();

    expect(extractor.receipt).toBe("receipt-data");
    expect(extractor.ballotCode).toBe("ballot-123");
    expect(extractor.trackingCode).toBeUndefined();
  });

  it("extracts the tracking code from legacy receipts", async () => {
    const file = await buildReceiptFile({
      Receipt: "legacy-receipt",
      TrackingCode: "tracking-456",
    });
    const extractor = new ReceiptPDFExtractor(file);

    await extractor.extract();

    expect(extractor.receipt).toBe("legacy-receipt");
    expect(extractor.trackingCode).toBe("tracking-456");
    expect(extractor.ballotCode).toBeUndefined();
  });

  it("extracts both codes when both are present", async () => {
    const file = await buildReceiptFile({
      Receipt: "r",
      TrackingCode: "t",
      BallotCode: "b",
    });
    const extractor = new ReceiptPDFExtractor(file);

    await extractor.extract();

    expect(extractor.trackingCode).toBe("t");
    expect(extractor.ballotCode).toBe("b");
  });

  it("rejects files without a receipt", async () => {
    const file = await buildReceiptFile({ BallotCode: "ballot-123" });
    const extractor = new ReceiptPDFExtractor(file);

    await expect(extractor.extract()).rejects.toThrow("Invalid receipt file");
    expect(extractor.receipt).toBeUndefined();
  });

  it("rejects files without a ballot or tracking code", async () => {
    const file = await buildReceiptFile({ Receipt: "receipt-data" });
    const extractor = new ReceiptPDFExtractor(file);

    await expect(extractor.extract()).rejects.toThrow("Invalid receipt file");
  });

  it("rejects files that are not PDFs", async () => {
    const file = new File(["not a pdf"], "receipt.pdf");
    const extractor = new ReceiptPDFExtractor(file);

    await expect(extractor.extract()).rejects.toThrow();
  });
});
