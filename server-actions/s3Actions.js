"use server";

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  CopyObjectCommand,
}  from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";


const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

if (
    !process.env.S3_BUCKET_NAME ||
    !process.env.S3_TEMP_PREFIX ||
    !process.env.S3_PERMANENT_PREFIX ||
    !process.env.AWS_REGION ||
    !process.env.AWS_ACCESS_KEY_ID ||
    !process.env.AWS_SECRET_ACCESS_KEY
  ) {
    throw new Error(
      "Missing required environment variables: Check S3_BUCKET_NAME, S3_TEMP_PREFIX, S3_PERMANENT_PREFIX, AWS_REGION, AWS_ACCESS_KEY_ID, or AWS_SECRET_ACCESS_KEY"
    );
  }
  

export const getUploadURL = async (fileName, fileType, isTemporary) => {
  const prefix = isTemporary
    ? process.env.S3_TEMP_PREFIX
    : process.env.S3_PERMANENT_PREFIX;
  const key = `${prefix}${Date.now()}/${fileName}`;
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    ContentType: fileType,
  });
  try {
    const uploadUrl = await getSignedUrl(s3, command, {
      expiresIn: process.env.S3_URL_EXPIRY,
    });
    return {
      success: true,
      message: "Upload link generated successfully",
      data: {
        uploadUrl,
        key,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to generate upload URL",
      error: error.message,
      data: {},
    };
  }
};

export const getViewURL = async (key) => {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
  });
  try {
    const viewURL = await getSignedUrl(s3, command, {
      expiresIn: process.env.S3_URL_EXPIRY,
    });
    return {
      success: true,
      message: "View link generated successfully",
      data: {
        url: viewURL,
        key,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to generate view URL",
      error: error.message,
      data: {},
    };
  }
};

export const deleteObject = async (key) => {
  const command = new DeleteObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
  });
  try {
    await s3.send(command);
    return {
      success: true,
      message: "File deleted successfully",
      data: {
        key,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to delete file, try again !!!",
      error: error.message,
      data: {},
    };
  }
};

const moveToFolder = async (key, moveLocation) => {
    try {
      const command = new CopyObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        CopySource: `${process.env.S3_BUCKET_NAME}/${key}`,
        Key: moveLocation,
      });
  
      await s3.send(command);
      await deleteFile(key);
    } catch (error) {
      console.error("Error moving file:", error);
      throw new Error("Failed to move file.");
    }
  };
  
export const moveToPermanent = async (key) => {
  const fileName = key.split("/").at(-1);
  const now = new Date();
  const day = now.getDate().toString().padStart(2, "0");
  const month = now.toLocaleDateString("en-US", { month: "short" });
  const year = now.getFullYear();
  const uuid = Math.random().toString(36).substring(2, 9);
  const permanentFile = `${process.env.S3_PERMANENT_PREFIX}${year}/${month}/${day}/${uuid}_${fileName}`;
  try {
    await moveToFolder(key, permanentFile, fileName);
    return {
      success: true,
      message: "File moved successfully",
      data: {
        key: permanentFile,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to move file to permanent, try again !!!",
      error: error.message,
      data: {},
    };
  }
};
