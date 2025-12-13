import express, { Request, Response } from 'express';
import multer from 'multer';
import imageService from '../services/imageService';

const router = express.Router();

// Увеличиваем лимит до 50MB
const upload = multer({ 
  dest: 'uploads/',
  limits: { 
    fileSize: 50 * 1024 * 1024  // 50MB
  }
});

// POST /api/convert/image
router.post('/image', upload.single('file'), async (req: Request, res: Response) => {
  try {
    const file = req.file;
    const { format, quality } = req.body;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('\n========== SERVER ==========');
    console.log('Original file:', file.originalname);
    console.log('Original size:', (file.size / 1024 / 1024).toFixed(2), 'MB');
    console.log('Target format:', format);
    console.log('Quality (raw):', quality, '(type:', typeof quality, ')');
    console.log('Quality (parsed):', parseInt(quality));
    console.log('============================\n');

    const { buffer, cleanup } = await imageService.convertImage(
      file.path,
      format,
      parseInt(quality)
    );

    console.log('Result size:', (buffer.length / 1024 / 1024).toFixed(2), 'MB');
    console.log('============================\n');

    res.set({
      'Content-Type': `image/${format}`,
      'Content-Disposition': `attachment; filename="converted.${format}"`
    });
    
    res.send(buffer);
    await cleanup();

  } catch (error) {
    console.error('Conversion error:', error);
    res.status(500).json({ error: 'Conversion failed' });
  }
});


export default router;
