const express = require("express");
const { createNote, getNote, updateNote, deleteNote, myNotes, viewMyNote } = require("../controllers/noteController");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", authenticateToken, createNote);
router.post("/get", authenticateToken, getNote);
router.post("/update", authenticateToken, updateNote);
router.post("/delete", authenticateToken, deleteNote);
router.get("/myNotes", authenticateToken, myNotes);
router.post("/view", authenticateToken, viewMyNote);

module.exports = router;
