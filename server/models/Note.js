const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
    noteText: {
        iv: { type: String, required: true },
        content: { type: String, required: true }
    },
    notePassword: { type: String },
    noteViewOnce: { type: Boolean },
    noteViewAlways: { type: Boolean },
    noteUrl: { type: String, required: true, unique: true },
    noteValidationTime: { type: Number },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.model("Note", noteSchema);
