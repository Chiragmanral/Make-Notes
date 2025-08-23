require("dotenv").config();
const crypto = require("crypto");
const algorithm = "aes-256-cbc";
const secretKey = Buffer.from(process.env.NOTE_SECRET_KEY, "hex"); // must be 64 hex chars (32 bytes)

// ✅ Validate key length
if (secretKey.length !== 32) {
    throw new Error(
        `❌ Invalid NOTE_SECRET_KEY length: got ${secretKey.length} bytes, expected 32. 
        Make sure your key in .env is 64 hex characters (32 bytes).`
    );
}

// 🔒 Encrypt note text
function encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return {
        iv: iv.toString("hex"),
        content: encrypted
    };
}

// 🔓 Decrypt note text
function decrypt(hash) {
    const decipher = crypto.createDecipheriv(
        algorithm,
        secretKey,
        Buffer.from(hash.iv, "hex")
    );
    let decrypted = decipher.update(hash.content, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}

module.exports = { encrypt, decrypt }; 
