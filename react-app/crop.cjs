const Jimp = require('jimp');

async function cropImage() {
  try {
    const image = await Jimp.read('public/assets/img/normal/whatsapp_dashboard.jpg');
    const width = image.bitmap.width;
    const height = image.bitmap.height;
    
    // The grey padding is roughly 12% on all sides
    const cropX = Math.floor(width * 0.11);
    const cropY = Math.floor(height * 0.11);
    const cropWidth = Math.floor(width - (cropX * 2));
    const cropHeight = Math.floor(height - (cropY * 2));
    
    image.crop(cropX, cropY, cropWidth, cropHeight);
    await image.writeAsync('public/assets/img/normal/whatsapp_dashboard_cropped.jpg');
    console.log("Cropped successfully!");
  } catch(e) {
    console.error("Error cropping image:", e);
  }
}

cropImage();
