import { PDFDocument, PDFName, PDFParser } from "pdf-lib";

// @ts-ignore: Extends a class that has a private constructor
export class PDFReceiptDocument extends PDFDocument {
  static async loadReceipt(file: File) {
    const ignoreEncryption = false;
    const updateMetadata = false;

    return new Promise((resolve, reject) => {
      // FileReader api
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = async () => {
        try {
          const buffer: ArrayBuffer = reader.result;
          const bytes = new Uint8Array(buffer);
          const context = await PDFParser.forBytesWithOptions(
            bytes
          ).parseDocument();
          const pdfReceiptDoc = new PDFReceiptDocument(
            context,
            ignoreEncryption,
            updateMetadata
          );
          resolve(pdfReceiptDoc);
        } catch (err) {
          reject((err as Error).message);
        }
      };
      reader.onerror = () => {
        reject("Could not load receipt file");
      };
    });
  }

  public getReceipt(): string | undefined {
    const receiptName = PDFName.of("Receipt");
    // @ts-ignore: Calling a private method from PDFDocument
    const receipt = this.getInfoDict().lookup(receiptName);
    if (!receipt) return undefined;
    return receipt.decodeText();
  }

  public getTrackingCode(): string | undefined {
    const trackingCodeName = PDFName.of("TrackingCode");
    // @ts-ignore: Calling a private method from PDFDocument
    const trackingCode = this.getInfoDict().lookup(trackingCodeName);
    if (!trackingCode) return undefined;
    return trackingCode.decodeText();
  }
}
