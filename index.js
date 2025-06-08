const express = require('express');
const htmlToDocx = require('html-to-docx');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json({ limit: '10mb' }));

app.post('/generate-doc', async (req, res) => {
  const { html, title } = req.body;
  if (!html || !title) return res.status(400).json({ error: 'Missing HTML or title' });

  try {
    const buffer = await htmlToDocx(html, null, {
      table: { row: { cantSplit: true } },
      footer: true,
      pageNumber: true,
    });

    const fileName = `${title.replace(/[^a-zA-Z0-9]/g, '_')}.docx`;
    const filePath = path.join(__dirname, fileName);
    fs.writeFileSync(filePath, buffer);

    res.download(filePath, fileName, () => {
      fs.unlinkSync(filePath); // cleanup
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
