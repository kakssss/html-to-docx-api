const htmlDocx = require('html-docx-js');
const fs = require('fs');
const path = require('path');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const html = req.body;

    if (!html || html.length < 10) {
      return res.status(400).send('Missing or invalid HTML');
    }

    const docxBuffer = htmlDocx.asBlob(html);
    const filename = `article_${Date.now()}.docx`;
    const filePath = path.join('/tmp', filename);

    fs.writeFileSync(filePath, docxBuffer);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.sendFile(filePath);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '5mb',
      text: true, // لازم عشان نستقبل HTML كنص
    },
  },
};
