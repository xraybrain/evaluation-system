import * as path from 'path';
import * as fs from 'fs';
import { NextFunction, Request, Response } from 'express';
import formidable, { File, IncomingForm } from 'formidable';
import { v2 as cloudinary } from 'cloudinary';
import * as dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env['CLOUD_NAME'],
  api_key: process.env['CLOUD_KEY'],
  api_secret: process.env['CLOUD_SECRET'],
  secure: true,
});

const MAX_FILE_SIZE = 5_000_000; // 5mb
const defaultUploadDir = '../../filesystem/';

const getExtension = (document: File) =>
  document.name?.substring(document.name?.lastIndexOf('.'));

const exceedMaxFileSize = (size: number): boolean => size > MAX_FILE_SIZE;

export const FormidableModule =
  (uploadDir?: string) => (req: Request, res: Response, next: NextFunction) => {
    let uploadTo = uploadDir || defaultUploadDir;
    let form = new IncomingForm();
    let feedback = new Feedback();
    feedback.message = '';
    feedback.results = [];
    let canUpload = true;

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.log('Form Parse Error: ', err);
        feedback.success = false;
        feedback.message = 'Failed to process upload.';
        canUpload = false;
      }

      if (files.upload !== undefined) {
        let uploadFiles: File[];
        if (files.upload instanceof Array) {
          uploadFiles = files.upload;
        } else {
          uploadFiles = [files.upload];
        }

        // Loop through upload files
        for (let file of uploadFiles) {
          let tempPath = file.path;
          let document: DocumentUpload = {
            size: file.size,
            name: `${file.name}`,
            type: `${file.type}`,
            extension: path.extname(file.name as string).replace('.', ''),
            url: '',
          };

          if (exceedMaxFileSize(file.size)) {
            canUpload = false;
            feedback.message = `filesize must between ${
              MAX_FILE_SIZE / (1000 * 1000)
            } mb`;
            feedback.success = false;
          }

          if (canUpload) {
            feedback.formData = fields;
            if (process.env.NODE_ENV === 'production') {
              // Use cloudinary in prod
              try {
                let c = await cloudinary.uploader.upload(tempPath);
                document.url = c.secure_url;
                feedback.message += `${file.name} uploaded successfully.`;
                feedback.results?.push(document);
                console.log(document);
                console.log(feedback);
              } catch (error) {
                feedback.message += `An error occured while uploading ${file.name}.`;
              }
            } else {
              try {
                let fileName = `${Date.now()}${path.extname(
                  file.name as string
                )}`;
                //-- upload file
                let data = fs.readFileSync(tempPath);
                let newUploadDir = path.resolve(__dirname, uploadTo, fileName);
                fs.writeFileSync(newUploadDir, data);
                feedback.message += `${file.name} uploaded successfully`;
                document.url = `/${uploadTo.replace(
                  /(\.\.\/)+?(public\/)?/g,
                  ''
                )}/${fileName}`;
                feedback.results?.push(document);
              } catch (error) {
                feedback.message += `An error occured while uploading ${file.name}.`;
                console.log(error);
              }
            }
          }
        }
        req.body = feedback;
        next();
      } else {
        feedback.success = false;
        feedback.message = "Missing 'upload' field";
        req.body = feedback;
        next();
      }
    });
  };
