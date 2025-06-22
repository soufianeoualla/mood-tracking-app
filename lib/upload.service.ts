import axios from "axios";

const uploadService = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData
    );

    if (response.status !== 200) {
      throw new Error("Failed to upload image");
    }

    const data = await response.data;
    return data;
  } catch {
    throw new Error("Failed to upload image");
  }
};

export default uploadService;
