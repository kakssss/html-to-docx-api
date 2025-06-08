const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const htmlDocx = require('html-docx-js');

const app = express();
const PORT = process.env.PORT || 3000;

// استلام HTML كـ نص
app.use(bodyParser.text({ type: 'text/html' }));

// راوت التحويل
app.post('/generate-docx', (req, res) => {
  const html = req.body;

  if (!html || html.length < 10) {
    return res.status(400).send('HTML content is required');
  }

  try {
    const docxBuffer = htmlDocx.asBlob(html);
    const filename = `article_${Date.now()}.docx`;
    const filepath = path.join(__dirname, filename);

    fs.writeFileSync(filepath, docxBuffer);

    // تحميل الملف
    res.download(filepath, filename, err => {
      fs.unlinkSync(filepath); // حذف الملف بعد التنزيل
      if (err) console.error('Download error:', err);
    });

  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Server error while generating Word file');
  }
});

// تشغيل السيرفر
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
