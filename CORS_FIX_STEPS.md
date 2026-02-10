# How to Fix the "Submit Button" Issue (CORS Error)

## ⚠️ Solution: Force Create Bucket via Terminal

Since the Firebase Console UI is failing (which happens sometimes), we can create the bucket directly from the **Cloud Shell** (where you were typing commands).

**Paste this command in the Cloud Shell and press Enter:**

```bash
gsutil mb -p kindcents -l us-central1 -b on gs://kindcents.firebasestorage.app
```

*   **If it says "Success"**: Great!
*   **If it says "409 Conflict"**: The bucket already exists (maybe the UI worked partially).
*   **If it fails**: Try this backup name:
    ```bash
    gsutil mb -p kindcents -l us-central1 -b on gs://kindcents.appspot.com
    ```

**Once the bucket is created, run the CORS command again:**

```bash
gsutil cors set cors.json gs://kindcents.firebasestorage.app
```
*(Or use the `.appspot.com` name if that was the one you created)*.
