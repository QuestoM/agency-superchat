const fs = require('fs');
const path = require('path');

exports.exportChat = (req, res) => {
  const { messages } = req.body;
  const exportText = messages.map(m => `${m.isUser ? 'User' : 'AI'}: ${m.text}`).join('\n');
  
  const fileName = `chat_export_${Date.now()}.txt`;
  const filePath = path.join(__dirname, '..', 'exports', fileName);

  fs.writeFile(filePath, exportText, (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return res.status(500).json({ error: 'Failed to export chat' });
    }
    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        return res.status(500).json({ error: 'Failed to send exported file' });
      }
      // Delete the file after sending
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) console.error('Error deleting file:', unlinkErr);
      });
    });
  });
};