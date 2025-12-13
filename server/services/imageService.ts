import sharp from 'sharp';
import fs from 'fs/promises';

class ImageService {
  async convertImage(
  inputPath: string, 
  format: string, 
  quality: number
): Promise<{ buffer: Buffer; cleanup: () => Promise<void> }> {
  
  try {
    let sharpInstance = sharp(inputPath);
    
    const metadata = await sharpInstance.metadata();
    console.log('Sharp metadata:', {
      format: metadata.format,
      width: metadata.width,
      height: metadata.height,
      space: metadata.space,
      channels: metadata.channels,
      hasAlpha: metadata.hasAlpha
    });
    
    console.log('Converting with quality:', quality);
    
    switch(format) {
      case 'jpeg':
        console.log('Using JPEG with mozjpeg');
        sharpInstance = sharp(inputPath).jpeg({ 
          quality,
          mozjpeg: true,
          chromaSubsampling: '4:2:0'
        });
        break;
        
      case 'webp':
        console.log('Using WebP with smartSubsample');
        sharpInstance = sharp(inputPath).webp({ 
          quality,
          effort: 4,
          smartSubsample: true,
          nearLossless: false,
          alphaQuality: quality
        });
        break;
        
      case 'avif':
        console.log('Using AVIF');
        sharpInstance = sharp(inputPath).avif({ 
          quality,
          effort: 3,
          chromaSubsampling: '4:2:0'
        });
        break;
        
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
    
    const buffer = await sharpInstance.toBuffer();
    const sizeMB = (buffer.length / 1024 / 1024).toFixed(2);
    
    console.log(`✅ Conversion complete: ${sizeMB} MB`);
    
    const cleanup = async () => {
      try {
        await fs.unlink(inputPath);
      } catch (err) {
        console.error('⚠️ Cleanup error:', err);
      }
    };
    
    return { buffer, cleanup };
    
  } catch (error) {
    console.error('❌ ImageService error:', error);
    throw error;
  }
}
}

export default new ImageService();
