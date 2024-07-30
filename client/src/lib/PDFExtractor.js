export default class PDFExtractor {
  constructor(text) {
    this.text = text
  }

  receipt() {
    return this.text.match(/Receiptdata:(.+)/)[1]
  }

  trackingCode() {
    return this.text.match(/codeforballottracker(.{7})/)[1]
  }
}
