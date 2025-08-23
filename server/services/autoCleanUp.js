// Cleaning expired notes after every 4 hours
// setInterval(cleanExpiredNotes, 4 * 60 * 60 * 1000);

const cleanExpiredNotes = async () => {
    const currentTime = Date.now();

    try {
        const result = await notes.deleteMany({
            noteValidationTime: { $exists: true, $lt: currentTime },
            $and: [
                { $or: [{ noteViewOnce: { $ne: true } }, { noteViewOnce: { $exists: false } }] },
                { $or: [{ noteViewAlways: { $ne: true } }, { noteViewAlways: { $exists: false } }] }
            ]

        });

        if (result.deletedCount > 0) {
            console.log(`✅ Auto-cleanup: Deleted ${result.deletedCount} expired notes.`);
        } else {
            console.log("ℹ️ Auto-cleanup: No expired notes found.");
        }
    } catch (error) {
        console.error("❌ Auto-cleanup failed:", error);
    }
}

module.exports = cleanExpiredNotes;