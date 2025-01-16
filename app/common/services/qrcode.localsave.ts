import fs from 'fs';
import path from 'path';


export const saveQRCodeLocally = async (qrCodeBase64: string, fileName: string): Promise<string> => {
  try {
  
    const directoryPath = path.join(__dirname, 'public', 'qr-codes');
    
   
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }

   
    const buffer = Buffer.from(qrCodeBase64.split(',')[1], 'base64');
    
   
    const filePath = path.join(directoryPath, fileName);
    
    
    await fs.promises.writeFile(filePath, buffer);
    
  
    return `/qr-codes/${fileName}`; 
  } catch (error) {
    console.error("Error saving QR code locally:", error);
    throw new Error("Failed to save QR code locally");
  }
};
