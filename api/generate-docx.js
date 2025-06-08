const htmlDocx = require('html-docx-js');
const fs = require('fs');
const path = require('path');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const html = req.body;
  if (!html || html.length < 10) return res.status(400).send('Missing HTML');

  const name = `article_${Date.now()}.docx`;
  const filepath = path.join('/tmp', name);
  const buffer = htmlDocx.asBlob(html);

  fs.writeFileSync(filepath, buffer);
  res.setHeader('Content-Disposition', `attachment; filename="${name}"`);
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  res.sendFile(filepath);
}

export const config = {
  api: {
    bodyParser: {
      text: true,
      sizeLimit: '5mb'
    }
  }
};
