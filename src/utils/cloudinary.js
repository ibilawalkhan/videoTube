import { v2 as cloudinary } from "cloudinary"
import fs from "fs"
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        console.log("In start of uploadOnCloudinary");
        console.log("localFilePath:", localFilePath);

        if (!localFilePath) {
            console.log("Local file path is missing.");
            return null;
        }

        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });

        console.log("Cloudinary response:", response);

        // Remove the locally saved temporary file after successful upload
        fs.unlinkSync(localFilePath);

        return response;
    } catch (error) {
        console.log("Error in uploadOnCloudinary:", error.message);

        // Remove the locally saved temporary file as the upload operation failed
        fs.unlinkSync(localFilePath);

        return null;
    }
};

export { uploadOnCloudinary };