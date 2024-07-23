export default class PDFExtractor {
  constructor(text) {
    this.text = text
    const b64Signature = this.text.match(/DBBsignature:(.+)/)[1];
    this.json = JSON.parse(atob(b64Signature));
  }

  address() {
    return this.json.address
  }

  voterSignature() {
    return this.json.voter_signature
  }

  dbbSignature() {
    return this.json.dbb_signature
  }

  shortAddress() {
    return this.text.match(/codeforballottracker(.{7})/)[1]
  }
}
