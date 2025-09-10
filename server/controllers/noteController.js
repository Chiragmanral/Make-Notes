const bcrypt = require("bcrypt");
const randomUrl = require("random-url");
const Note = require("../models/Note");
const { encrypt, decrypt } = require("../utils/cryptoUtils");

// Create note
exports.createNote = async (req, res) => {
    const body = req.body;
    const url = randomUrl("https");
    let hashedPassword = null;

    if (body.notePassword) {
        hashedPassword = await bcrypt.hash(body.notePassword, 10);
    }

    const encrypted = encrypt(body.noteText);

    const payload = {
        noteText: encrypted,
        notePassword: hashedPassword,
        noteUrl: url,
        createdBy: req.user.id
    };

    switch(body.noteDuration) {
        case "once": payload.noteViewOnce = true; break;
        case "always": payload.noteViewAlways = true; break;
        case "1hr": payload.noteValidationTime = Date.now() + 3600000; break;
        case "8hr": payload.noteValidationTime = Date.now() + 28800000; break;
        case "1day": payload.noteValidationTime = Date.now() + 86400000; break;
    }

    try {
        await Note.create(payload);
        return res.status(201).json({ generatedLink: url });
    } catch (err) {
        return res.status(500).json({ msg: "Error creating note", error: err.message });
    }

};

// Get a note
exports.getNote = async (req, res) => {
    const { noteLinkCredential, passwordCredential } = req.body;
    const note = await Note.findOne({ noteUrl: noteLinkCredential });
    if (!note) return res.status(200).json({ msg: "Note expired or not found" });

    if (note.notePassword && !(await bcrypt.compare(passwordCredential, note.notePassword))) {
        return res.status(200).json({ msg: "Wrong link or password" });
    }

    const decryptedText = decrypt(note.noteText);

    if (note.noteViewOnce) {
        await Note.deleteOne({ noteUrl: noteLinkCredential });
        return res.status(202).json({ text: decryptedText });
    }
    if (note.noteViewAlways) return res.status(202).json({ text: decryptedText });

    const currentTime = Date.now();
    if (note.noteValidationTime && currentTime > note.noteValidationTime) {
        await Note.deleteOne({ noteUrl: noteLinkCredential });
        return res.status(200).json({ msg: "Note expired" });
    }

    return res.status(202).json({ text: decryptedText });
};

// View Note
exports.viewMyNote = async (req, res) => {
    const { noteUrl } = req.body;

    try {
        const note = await Note.findOne({ noteUrl, createdBy: req.user.id });

        if (!note) {
            return res.status(404).json({ msg: "Note not found or you are not the author" });
        }

        const decryptedText = decrypt(note.noteText);

        return res.status(202).json({
            text: decryptedText,
            isPassword: note.notePassword ? "Password protected" : "No password"
        });
    }
    catch (err) {
        console.error("Error viewing note:", err);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

// Update note
exports.updateNote = async (req, res) => {
    const { noteUrl, updatedNoteText } = req.body;
    const encryptedText = encrypt(updatedNoteText);
    const note = await Note.findOneAndUpdate(
        { noteUrl, createdBy: req.user.id },
        { noteText: encryptedText }
    );
    if (note) return res.status(200).json({ success: true });
    return res.status(200).json({ success: false });
};

// Delete note
exports.deleteNote = async (req, res) => {
    const { noteUrl } = req.body;
    const deleted = await Note.deleteOne({ noteUrl, createdBy: req.user.id });
    return res.status(200).json({ deleted: deleted.deletedCount === 1 });
};

// My Notes
exports.myNotes = async (req, res) => {
    const userNotes = await Note.find({ createdBy: req.user.id });
    if(!userNotes) return res.status(404).json({ msg : "Notes not found" });
    return res.status(202).json({ notes: userNotes });
};
