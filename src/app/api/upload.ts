// pages/api/upload.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files: any) => {
    if (err) return res.status(500).json({ error: 'Error parsing file' });

    const file = files.file?.[0] || files.file;
    const path = file.filepath;

    try {
      const result = await cloudinary.uploader.upload(path, {
        folder: 'profile_pictures',
      });
      fs.unlinkSync(path); // optional: delete after upload
      res.status(200).json({ url: result.secure_url });
    } catch (uploadErr) {
      res.status(500).json({ error: 'Upload failed', details: uploadErr });
    }
  });
}
