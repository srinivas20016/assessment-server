module.exports = (req, res, next) => {
    if (req.user.role !== "auditor") {
       return res.status(401).json({ error: "Unauthorized!" });
    }
    next();
}