import {PDFDocument, PDFName} from "pdf-lib";

export class ReceiptPDFExtractor {
  private readonly file: File
  public receipt: string
  public trackingCode: string

  constructor(file: File) {
    this.file = file
  }

  public async extract() {
    return new Promise((resolve, reject) => {
      // FileReader api
      const reader = new FileReader();
      reader.readAsArrayBuffer(this.file);
      reader.onload = async () => {
        let pdfDoc
        try {
          pdfDoc = await PDFDocument.load(reader.result, {updateMetadata: false})
        } catch (err) {
          reject(err.message)
          return
        }

        const receiptName = PDFName.of('Receipt')
        const receipt = pdfDoc.getInfoDict().lookup(receiptName)

        const trackingCodeName = PDFName.of('TrackingCode')
        const trackingCode = pdfDoc.getInfoDict().lookup(trackingCodeName)

        if (receipt == null || trackingCode == null) {
          reject("Invalid receipt file")
          return
        }

        this.receipt = receipt.decodeText()
        this.trackingCode = trackingCode.decodeText()

        resolve()
      }
      reader.onerror = () => {
        reject("Could not load receipt file")
      }
    })
  }
}
