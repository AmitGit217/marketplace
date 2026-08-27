export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export const cloudinaryApi = {
  uploadImage: async (
    file: File
  ): Promise<CloudinaryUploadResponse> => {
    const cloudName =
      import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

    const uploadPreset =
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error(
        "Cloudinary configuration is missing."
      );
    }

    const formData = new FormData();

    formData.append("file", file);
    formData.append(
      "upload_preset",
      uploadPreset
    );

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.text();

      throw new Error(
        `Cloudinary upload failed: ${error}`
      );
    }

    return response.json();
  },
};