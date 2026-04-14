require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("./db");

const app = express();

const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USER || "admin",
  password: process.env.ADMIN_PASSWORD || "admin123"
};

const uploadDir = path.join(__dirname, "public", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `product-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({ storage });

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || "bkp-homes-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));
app.use(express.static("public"));

function requireAdmin(req, res, next) {
  if (req.session && req.session.isAdmin) {
    return next();
  }
  res.status(401).json({ error: "Unauthorized" });
}

app.post("/admin/login", (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    req.session.isAdmin = true;
    return res.json({ ok: true });
  }
  res.status(401).json({ error: "Invalid credentials" });
});

app.post("/admin/logout", (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

app.get("/admin/status", (req, res) => {
  res.json({ isAdmin: !!req.session?.isAdmin });
});

app.get("/products", (req, res) => {
  const { search, category } = req.query;

  let sql = "SELECT * FROM products WHERE 1=1";
  const params = [];

  if (search) {
    sql += " AND name LIKE ?";
    params.push(`%${search}%`);
  }

  if (category) {
    sql += " AND category = ?";
    params.push(category);
  }

  db.query(sql, params, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.get("/products/:id", (req, res) => {
  db.query("SELECT * FROM products WHERE id = ?", [req.params.id], (err, result) => {
    if (err) throw err;
    res.json(result[0]);
  });
});

app.post("/products", requireAdmin, upload.single("image_file"), (req, res) => {
  const { name, price, description, category, material, size, image_url } = req.body;
  const uploadedFile = req.file;
  const finalImageUrl = uploadedFile ? `/uploads/${uploadedFile.filename}` : image_url;

  if (!finalImageUrl) {
    return res.status(400).json({ error: "Image upload or image URL is required." });
  }

  const sql = `INSERT INTO products (name, price, description, category, material, size, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [name, price, description, category, material, size, finalImageUrl], (err, result) => {
    if (err) throw err;
    res.json({ message: "Added", id: result.insertId });
  });
});

app.delete("/products/:id", requireAdmin, (req, res) => {
  db.query("DELETE FROM products WHERE id = ?", [req.params.id], (err) => {
    if (err) throw err;
    res.json({ message: "Deleted" });
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Running → http://localhost:${port}`));
