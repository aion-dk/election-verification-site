import {PDFDocument, PDFName, PDFParser, PDFContext} from "pdf-lib";

export class PDFReceiptDocument extends PDFDocument{

  private constructor(context: PDFContext, ignoreEncryption: boolean, updateMetadata: boolean) {
    super(context, ignoreEncryption, updateMetadata)
  }

  static async loadReceipt(file: File) {
    const ignoreEncryption = false
    const updateMetadata = false

    return new Promise((resolve, reject) => {
      // FileReader api
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = async () => {
        try {
          const bytes = new Uint8Array(reader.result);
          const context = await PDFParser.forBytesWithOptions(bytes).parseDocument();
          const pdfReceiptDoc = new PDFReceiptDocument(context, ignoreEncryption, updateMetadata);
          resolve(pdfReceiptDoc)
        } catch (err: Error) {
          reject(err.message)
          return
        }
      }
      reader.onerror = () => {
        reject("Could not load receipt file")
      }
    })
  }

  public getReceipt(): string | undefined {
    const receiptName = PDFName.of('Receipt')
    // @ts-ignore: Calling a private method from PDFDocument
    const receipt = this.getInfoDict().lookup(receiptName);
    if (!receipt) return undefined;
    return receipt.decodeText();
  }

  public getTrackingCode(): string | undefined {
    const trackingCodeName = PDFName.of('TrackingCode')
    // @ts-ignore: Calling a private method from PDFDocument
    const trackingCode = this.getInfoDict().lookup(trackingCodeName);
    if (!trackingCode) return undefined;
    return trackingCode.decodeText();
  }
}
