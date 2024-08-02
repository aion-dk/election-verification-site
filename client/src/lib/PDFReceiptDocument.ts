import { PDFDict, PDFDocument, PDFName, PDFParser } from "pdf-lib";

// @ts-ignore: Extends a class that has a private constructor
export class PDFReceiptDocument extends PDFDocument {
  static async loadReceipt(file: File): Promise<PDFReceiptDocument> {
    const ignoreEncryption = false;
    const updateMetadata = false;

    return new Promise<PDFReceiptDocument>((resolve, reject) => {
      // FileReader api
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = async () => {
        try {
          const bytes = new Uint8Array(reader.result as ArrayBuffer);
          const context = await PDFParser.forBytesWithOptions(
            bytes
          ).parseDocument();
          // @ts-ignore: Calls a constructor that is private
          const pdfReceiptDoc = new PDFReceiptDocument(
            context,
            ignoreEncryption,
            updateMetadata
          );
          resolve(pdfReceiptDoc);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => {
        reject("Could not load receipt file");
      };
    });
  }

  public getReceipt(): string | undefined {
    const infoRef = this.context.trailerInfo.Info;
    const infoDict = this.context.lookup(infoRef) as PDFDict;
    const receipt = infoDict.lookup(PDFName.of("Receipt"));

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
