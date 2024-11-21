import { PDFDict, PDFDocument, PDFHexString, PDFName } from "pdf-lib";

export class ReceiptPDFExtractor {
  private readonly file: File;
  public receipt: string;
  public trackingCode: string;

  constructor(file: File) {
    this.file = file;
  }

  public async extract(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      // FileReader api
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const pdfDoc = await PDFDocument.load(reader.result, {
            updateMetadata: false,
          });

          const infoRef = pdfDoc.context.trailerInfo.Info;
          const infoDict = pdfDoc.context.lookup(infoRef) as PDFDict;

          const receipt = infoDict.lookup(
            PDFName.of("Receipt")
          ) as PDFHexString;
          const trackingCode = infoDict.lookup(
            PDFName.of("TrackingCode")
          ) as PDFHexString;

          if (receipt == null || trackingCode == null) {
            reject("Invalid receipt file");
          }

          this.receipt = receipt.decodeText();
          this.trackingCode = trackingCode.decodeText();

          resolve();
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => {
        reject("Could not load receipt file");
      };
      reader.readAsArrayBuffer(this.file);
    });
  }
}
