
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Logger Middleware
app.use((req, res, next) => {
  console.log(
    `${new Date().toISOString()} | ${req.method} | ${req.originalUrl}`
  );
  next();
});

// JSON dosyasinda veri saklama
const dataDir = path.join(__dirname, "data");
const dataFile = path.join(dataDir, "tasks.json");

fs.mkdirSync(dataDir, { recursive: true });

if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, "[]");
}

let tasks = JSON.parse(fs.readFileSync(dataFile, "utf8"));

function saveTasks() {
  fs.writeFileSync(dataFile, JSON.stringify(tasks, null, 2));
}

// 1. Tum gorevleri listele
app.get("/tasks", (req, res) => {
  res.json(tasks);
});

// 2. Gorev detayini getir
app.get("/tasks/:id", (req, res) => {
  const task = tasks.find(t => t.id === Number(req.params.id));

  if (!task) {
    return res.status(404).json({ message: "Gorev bulunamadi" });
  }

  res.json(task);
});

// 3. Yeni gorev ekle
app.post("/tasks", (req, res) => {
  const { title, description, assignee, priority } = req.body;

  if (!title || typeof title !== "string") {
    return res.status(400).json({ message: "Gorev basligi zorunludur" });
  }

  const task = {
    id: tasks.reduce((max, t) => Math.max(max, t.id), 0) + 1,
    title,
    description: description || "",
    assignee: assignee || "",
    priority: priority || "medium",
    status: "pending",
    createdAt: new Date().toISOString()
  };

  tasks.push(task);
  saveTasks();

  res.status(201).json(task);
});

// 4. Gorev guncelle
app.put("/tasks/:id", (req, res) => {
  const task = tasks.find(t => t.id === Number(req.params.id));

  if (!task) {
    return res.status(404).json({ message: "Gorev bulunamadi" });
  }

  Object.assign(task, req.body, { id: task.id });
  saveTasks();

  res.json(task);
});

// 5. Gorev sil
app.delete("/tasks/:id", (req, res) => {
  const index = tasks.findIndex(t => t.id === Number(req.params.id));

  if (index === -1) {
    return res.status(404).json({ message: "Gorev bulunamadi" });
  }

  tasks.splice(index, 1);
  saveTasks();

  res.json({ message: "Gorev silindi" });
});

// Sunucuyu baslat
app.listen(PORT, () => {
  console.log(`FitTrack API: http://localhost:${PORT}`);
});
