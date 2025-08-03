const ejs = require("ejs");
const fs = require("fs");
const path = require("path");
const pupetteer = require("puppeteer");

async function generateReport(type, data) {
  const templatePath = path.join(__dirname, "..", "templates", `${type}.ejs`);

  if (!templatePath) {
    throw new Error(`Template for ${type} not found`);
  }

  const html = ejs.renderFile(templatePath, data);
  const outputDir = path.join(__dirname, "..", "reports");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
  const filename = `${type}-invoice-${Date.now()}.pdf`;
  const outputPath = path.join(outputDir, filename);
  const browser = pupetteer.launch()
  const page = (await browser).newPage()
  await page.setContent(html)
  await page.pdf({path:outputPath, format: 'A4'});
  (await browser).close()
  return `/reports/${filename}`
}

module.exports = generateReport