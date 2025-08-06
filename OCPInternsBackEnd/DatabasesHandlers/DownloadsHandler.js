const mongoose = require("mongoose");

const downloadSchema = mongoose.Schema({
  documentId: {
    type: String,
    unique: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default : new Date()
  },
  applicationId: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
});

const DownloadModel = mongoose.model("DownloadModel", downloadSchema, "downloads");

// Create a new download record
async function createDownload(downloadData) {
  try {
    const downloadDoc = new DownloadModel(downloadData);
    await downloadDoc.save();
    return downloadDoc;
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      error.statusCode = 400;
    } else {
      error.statusCode = 500;
    }
    throw error;
  }
}

// Read download by documentId only
async function findDownload(documentId) {
  try {
    const download = await DownloadModel.findOne({ documentId });
    if (!download) {
      const notFoundError = new Error(`Download record with documentId ${documentId} not found`);
      notFoundError.statusCode = 404;
      throw notFoundError;
    }
    return download;
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    throw error;
  }
}

// Delete download by documentId
async function deleteDownload(documentId) {
  try {
    const deletedDownload = await DownloadModel.findOneAndDelete({ documentId });
    if (!deletedDownload) {
      const notFoundError = new Error(`Download record with documentId ${documentId} not found`);
      notFoundError.statusCode = 404;
      throw notFoundError;
    }
    return deletedDownload;
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    throw error;
  }
}

module.exports = {
  createDownload,
  findDownload,
  deleteDownload,
}; 
