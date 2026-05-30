# Firebase Storage CORS Configuration Guide

If you experience issues with cross-origin image retrieval or upload (e.g., download URLs blocking your frontend domain), you must set up CORS (Cross-Origin Resource Sharing) on your Firebase Storage bucket via the Google Cloud CLI (gsutil).

## 1. Create a `cors.json` File
Create a file named `cors.json` in your local directory (or anywhere on your machine) with the following content:

```json
[
  {
    "origin": [
      "*",
      "https://배포된-vercel-도메인.vercel.app",
      "http://localhost:5173",
      "http://localhost:3000"
    ],
    "method": ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS"],
    "responseHeader": [
      "Content-Type",
      "Authorization",
      "x-goog-resumable",
      "x-goog-upload-protocol",
      "x-goog-upload-command",
      "x-goog-upload-header-content-length",
      "x-goog-upload-header-content-type"
    ],
    "maxAgeSeconds": 3600
  }
]
```

## 2. Apply CORS Using Google Cloud Shell or SDK CLI
Run the following command to apply the CORS policy to your Firebase Storage bucket. Replace `YOUR_STORAGE_BUCKET_URI` with your actual bucket name (e.g. `your-project-id.appspot.com`):

```bash
gcloud storage buckets update gs://YOUR_STORAGE_BUCKET_URI --cors-file=cors.json
```

Or, if using the legacy `gsutil` CLI:

```bash
gsutil cors set cors.json gs://YOUR_STORAGE_BUCKET_URI
```

## 3. Verify
After setting CORS, the SDK can securely handle file uploads and download URLs directly from your customized domains.
