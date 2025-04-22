import { Request, Response } from 'express';
import fs from 'fs/promises';
import { createWorker } from 'tesseract.js';
import extractAadhaarInfo from '../utils/extractText';
import extractBackAadhaarInfo from '../utils/extractback';

export class UserController {
  static async processImage(req: Request, res: Response) {
    let worker;
    try {
      if (!req.files || typeof req.files !== 'object' || !('front' in req.files) || !('back' in req.files)) {
        return res.status(400).json({ success: false, message: 'Files are missing or invalid' });
      }

      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const frontFiles = files['front'];
      const backFiles = files['back'];

      const frontPath = frontFiles[0].path;
      const backPath = backFiles[0].path;

      worker = await createWorker('eng');

      const [frontResult, backResult] = await Promise.all([
        worker.recognize(frontPath),
        worker.recognize(backPath),
      ]);

      const frontText = frontResult.data.text;
      const backText = backResult.data.text;

      const frontData = extractAadhaarInfo(frontText);
      const backData = extractBackAadhaarInfo(backText);

      const finalData = {
        name: frontData.name,
        dob: frontData.dob,
        gender: frontData.gender,
        aadharNumber: frontData.aadharNumber,
        address: backData.address,
        phone: backData.phone,
        photo: undefined, 
        success: true,
        message: "Aadhaar data extracted successfully."
      };

      res.status(200).json(finalData);

    } catch (error) {
      console.error("OCR error:", error);
      res.status(500).json({ success: false, message: "Something went wrong with OCR." });
    } finally {
      if (worker) {
        await worker.terminate();
      }
      if (req.files) {
        const frontFiles = (req.files as { [fieldname: string]: Express.Multer.File[] })['front'];
        const backFiles = (req.files as { [fieldname: string]: Express.Multer.File[] })['back'];

        await Promise.all([
          frontFiles[0]?.path ? fs.unlink(frontFiles[0].path).catch(() => {}) : null,
          backFiles[0]?.path ? fs.unlink(backFiles[0].path).catch(() => {}) : null,
        ]);
      }
    }
  }
}
