import {PDFDocument, PDFName} from "pdf-lib";

export class ReceiptPDFExtractor {
  private pdf: File
  private pdfDoc: PDFDocument

  constructor(pdf: File) {
    this.pdf = pdf
  }

  public async parsePDF() {
    const buffer = await this.pdf.arrayBuffer()
    this.pdfDoc = await PDFDocument.load(buffer, {
      updateMetadata: false
    })
  }

  public receipt(): string {
    const receiptName = PDFName.of('Receipt')
    const receipt = this.pdfDoc.getInfoDict().lookup(receiptName)

    return receipt.decodeText()
  }

  public trackingCode(): string {
    const trackingCodeName = PDFName.of('TrackingCode')
    const trackingCode = this.pdfDoc.getInfoDict().lookup(trackingCodeName)
    return trackingCode.decodeText()
  }
}
