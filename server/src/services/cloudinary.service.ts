import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import crypto from "crypto";
import { config } from "../config/env.js";

cloudinary.config({
  cloud_name: config.cloudinaryCloudName,
  api_key: config.cloudinaryApiKey,
  api_secret: config.cloudinaryApiSecret,
  secure: true,
});

export class CloudinaryService {
  static extractPublicId(urlOrId: string): string | null {
    if (!urlOrId) {
      return null;
    }
    const match = urlOrId.match(/portfolio-website\/([^./?#]+)/);
    if (match && match[1]) {
      return `portfolio-website/${match[1]}`;
    }
    return null;
  }

  static async uploadThumbnail(buffer: Buffer): Promise<UploadApiResponse> {
    if (!config.cloudinaryCloudName || !config.cloudinaryApiKey || !config.cloudinaryApiSecret) {
      throw new Error("Cloudinary configuration is missing or incomplete.");
    }

    const uniqueSuffix = Date.now() + "-" + crypto.randomBytes(4).toString("hex");
    const publicId = `thumbnail-${uniqueSuffix}`;

    return new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "portfolio-website",
          public_id: publicId,
          resource_type: "image",
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error("Cloudinary upload failed"));
          } else {
            resolve(result);
          }
        }
      );
      uploadStream.end(buffer);
    });
  }

  static async deleteThumbnail(urlOrId: string): Promise<boolean> {
    const publicId = this.extractPublicId(urlOrId);
    if (!publicId) {
      return false;
    }

    if (!config.cloudinaryCloudName || !config.cloudinaryApiKey || !config.cloudinaryApiSecret) {
      return false;
    }

    try {
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: "image",
      });
      return result.result === "ok";
    } catch (error) {
      return false;
    }
  }
}
