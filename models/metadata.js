const mongoose = require("mongoose");

const metadataSchema = mongoose.Schema({
  fileName: { type: String, required: true },
  author: { type: String },
  uploader: { type: String },
  timesQueried: { type: Number },
  version: { type: Number },        // add version_type=external to elasticsearch and pass the version
  keywords: [
    {
      word: { type: String },
      count: { type: Number },
    },
  ]
}, { timestamps: true, collection: 'metadata' });

module.exports = mongoose.model("Metadata", metadataSchema);
