const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

const uploadImage = async (file, folder) => {
    const {secure_url: url} = await cloudinary.uploader.upload(file, {folder: folder});

    return {url};
}

const updateImage = async (url, newFile, folder) => {

    if (url?.includes("https://res.cloudinary.com")) {

        const publicId = url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));

        const {secure_url} = await cloudinary.uploader.upload(newFile, {public_id: publicId, folder: folder});

        return {url: secure_url}
    } else {
        return await uploadImage(newFile, folder)
    }
}

module.exports = {
    uploadImage,
    updateImage,
}