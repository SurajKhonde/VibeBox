import "multer";

declare global {
  namespace Express {
    namespace Multer {
      interface File {
        location?: string; // 👈 Add multer-s3 extra fields
        bucket?: string;
        key?: string;
        etag?: string;
      }
    }
  }
}
