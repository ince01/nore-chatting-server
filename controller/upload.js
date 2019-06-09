import { Storage } from '@google-cloud/storage';

const googleCloudStorage = new Storage({
  projectId: process.env.GCLOUD_STORAGE_BUCKET || 'nore-e51bd',
  keyFilename: process.env.GCLOUD_KEY_FILE || './gcs.json'
});

const bucket = googleCloudStorage.bucket(process.env.GCLOUD_STORAGE_BUCKET || 'nore-e51bd.appspot.com');


exports.uploadImage = (req, res, next) => {
  let responseData = {};

  if (!req.file) {
    responseData = {
      status: false,
      message: 'No file uploaded.'
    }
    res.status(400).json(responseData);
    return;
  }
  const filename = Date.now() + req.file.originalname;
  const blob = bucket.file(filename.trim());

  const blobStream = blob.createWriteStream({
    metadata: {
      contentType: req.file.mimetype
    }
  });

  blobStream.on("error", err => {
    next(err);
    return;
  });

  blobStream.on("finish", () => {
    // The public URL can be used to directly access the file via HTTP.
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
    responseData = {
      status: true,
      result: { publicUrl },
      message: 'Upload file success.'
    }
    // Make the image public to the web (since we'll be displaying it in browser)
    blob.makePublic().then(() => {
      res.status(200).json(responseData);
    });
  });

  blobStream.end(req.file.buffer);
}
