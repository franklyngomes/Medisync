const ejs = require("ejs");
const fs = require("fs");
const path = require("path");
const pupetteer = require("puppeteer");

async function generateReport(type, data) {
  const templatePath = path.join(__dirname, "..", "templates", `${type}.ejs`);

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template file not found for type: ${type}`);
  }
    // Converting logo to base64
  const logoPath = path.join(__dirname, "..", "public", "images", "logo-png.png");
  const logoBase64 = fs.readFileSync(logoPath, { encoding: "base64" });
  const logoDataUrl = `data:image/png;base64,${logoBase64}`;

  const html = await ejs.renderFile(templatePath, {...data,logoDataUrl});
  const outputDir = path.join(__dirname, "..", "reports");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
  const filename = `${type}-invoice-${Date.now()}.pdf`;
  const outputPath = path.join(outputDir, filename);
  const browser = await pupetteer.launch();
  const page = await browser.newPage();
  await page.setContent(html);
  await page.pdf({ path: outputPath, format: "A4" });
  await browser.close();
  return `/reports/${filename}`;
}

async function renderHtml(type, data, options = {}) {
  const templatePath = path.join(__dirname, "..", "templates", `${type}.ejs`);

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template file not found for type: ${type}`);
  }

  const logoPath = path.join(__dirname, "..", "public", "images", "logo-png.png");
  const logoBase64 = fs.readFileSync(logoPath, { encoding: "base64" });
  const logoDataUrl = `data:image/png;base64,${logoBase64}`;

  let html = await ejs.renderFile(templatePath, { ...data, logoDataUrl });

  // 🖨️ Optionally inject auto-print script
  if (options.autoPrint) {
    html = html.replace(
      "</body>",
      `<script>window.onload = () => window.print();</script></body>`
    );
  }

  return html;
}
module.exports = {generateReport, renderHtml};
