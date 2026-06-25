import { Cv, ICv } from "../models/cv.model.js";

export class CvService {
  static async uploadCv(filename: string, base64Data: string): Promise<ICv> {
    const base64Content = base64Data.split(";base64,").pop() || "";
    const buffer = Buffer.from(base64Content, "base64");

    await Cv.deleteMany({});

    const cv = new Cv({
      filename,
      contentType: "application/pdf",
      data: buffer,
    });
    return cv.save();
  }

  static async getCv(): Promise<ICv | null> {
    return Cv.findOne();
  }

  static async deleteCv(): Promise<boolean> {
    const result = await Cv.deleteMany({});
    return (result.deletedCount || 0) > 0;
  }
}
