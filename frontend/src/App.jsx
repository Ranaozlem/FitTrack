
import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:3000/tasks";

const emptyForm = {
  title: "",
  description: "",
  assignee: "",
  priority: "medium",
  status: "pending",
};

const statusLabels = {
  pending: "Bekliyor",
  "in-progress": "Devam Ediyor",
  completed: "Tamamlandı",
};

const priorityLabels = {
  low: "Düşük",
  medium: "Orta",
  high: "Yüksek",
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ ...emptyForm });
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function apiRequest(url, options = {}) {
    const response = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "İşlem başarısız.");
    }

    return data;
  }

  async function loadTasks() {
    try {
      const data = await apiRequest(API);
      setTasks(data);
      setError("");
    } catch {
      setError("Backend bağlantısı kurulamadı. Node.js sunucusunu kontrol et.");
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  function updateForm(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function resetForm() {
    setForm({ ...emptyForm });
    setEditId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.title.trim()) return;

    setSaving(true);
    setMessage("");

    try {
      if (editId !== null) {
        await apiRequest(`${API}/${editId}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
        setMessage("Görev başarıyla güncellendi.");
      } else {
        await apiRequest(API, {
          method: "POST",
          body: JSON.stringify(form),
        });
        setMessage("Yeni görev başarıyla eklendi.");
      }

      resetForm();
      await loadTasks();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function editTask(task) {
    setEditId(task.id);
    setForm({
      title: task.title || "",
      description: task.description || "",
      assignee: task.assignee || "",
      priority: task.priority || "medium",
      status: task.status || "pending",
    });
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteTask(id) {
    if (!window.confirm("Bu görevi silmek istiyor musun?")) return;

    try {
      await apiRequest(`${API}/${id}`, { method: "DELETE" });
      if (editId === id) resetForm();
      await loadTasks();
      setMessage("Görev silindi.");
    } catch (err) {
      setError(err.message);
    }
  }

  const completed = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  const pending = tasks.filter(
    (task) => task.status !== "completed"
  ).length;

  const visibleTasks = tasks.filter(
    (task) => filter === "all" || task.status === filter
  );

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">F</div>
          <div>
            <strong>FitTrack</strong>
            <small>Sağlık ve Spor Takip Sistemi</small>
          </div>
        </div>
        <span className="topbar-tag">TASKFLOW API</span>
      </header>

      <main className="container">
        <section className="welcome">
          <div>
            <p className="eyebrow">KİŞİSEL ANTRENMAN YÖNETİMİ</p>
            <h1>Hedeflerini takip et.</h1>
            <p>
              Antrenmanlarını planla, görevlerini yönet
              ve ilerlemeni tek panelden izle.
            </p>
          </div>
          <div className="welcome-emoji">🏋️</div>
        </section>

        <section className="stats">
          <div className="stat-card">
            <span>Toplam Görev</span>
            <strong>{tasks.length}</strong>
            <small>Oluşturulan antrenmanlar</small>
          </div>
          <div className="stat-card">
            <span>Devam Eden / Bekleyen</span>
            <strong>{pending}</strong>
            <small>Henüz tamamlanmadı</small>
          </div>
          <div className="stat-card">
            <span>Tamamlanan</span>
            <strong>{completed}</strong>
            <small>Başarıyla bitirilenler</small>
          </div>
        </section>

        {error && <div className="alert error">{error}</div>}
        {message && <div className="alert success">{message}</div>}

        <section className="content-grid">
          <div className="panel">
            <div className="section-heading">
              <h2>{editId !== null ? "Görevi Düzenle" : "Yeni Antrenman"}</h2>
              <p>Antrenman görevlerini buradan yönet.</p>
            </div>

            <form onSubmit={handleSubmit} className="task-form">
              <label>
                Antrenman Adı *
                <input
                  name="title"
                  value={form.title}
                  onChange={updateForm}
                  placeholder="Örn: 30 dakika kardiyo"
                  required
                />
              </label>

              <label>
                Açıklama
                <textarea
                  name="description"
                  value={form.description}
                  onChange={updateForm}
                  placeholder="Antrenmanın detayları..."
                  rows="3"
                />
              </label>

              <label>
                Sorumlu Kişi
                <input
                  name="assignee"
                  value={form.assignee}
                  onChange={updateForm}
                  placeholder="Örn: Üye 001"
                />
              </label>

              <div className="form-row">
                <label>
                  Öncelik
                  <select
                    name="priority"
                    value={form.priority}
                    onChange={updateForm}
                  >
                    <option value="low">Düşük</option>
                    <option value="medium">Orta</option>
                    <option value="high">Yüksek</option>
                  </select>
                </label>

                <label>
                  Durum
                  <select
                    name="status"
                    value={form.status}
                    onChange={updateForm}
                    disabled={editId === null}
                  >
                    <option value="pending">Bekliyor</option>
                    <option value="in-progress">Devam Ediyor</option>
                    <option value="completed">Tamamlandı</option>
                  </select>
                </label>
              </div>

              <button className="primary-button" disabled={saving}>
                {saving
                  ? "Kaydediliyor..."
                  : editId !== null
                    ? "Değişiklikleri Kaydet"
                    : "+ Antrenman Ekle"}
              </button>

              {editId !== null && (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={resetForm}
                >
                  İptal
                </button>
              )}
            </form>
          </div>

          <div className="panel">
            <div className="list-heading">
              <div className="section-heading">
                <h2>Antrenman Görevleri</h2>
                <p>Planlanan tüm aktivitelerin.</p>
              </div>

              <select
                className="filter-select"
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
              >
                <option value="all">Tümü</option>
                <option value="pending">Bekliyor</option>
                <option value="in-progress">Devam Ediyor</option>
                <option value="completed">Tamamlandı</option>
              </select>
            </div>

            <div className="task-list">
              {visibleTasks.length === 0 ? (
                <div className="empty-state">
                  <div>📋</div>
                  <h3>Henüz görev bulunmuyor</h3>
                  <p>İlk antrenmanını ekleyerek başlayabilirsin.</p>
                </div>
              ) : (
                visibleTasks.map((task) => (
                  <article className="task-card" key={task.id}>
                    <div className="task-top">
                      <span className={`status ${task.status}`}>
                        {statusLabels[task.status] || task.status}
                      </span>
                      <span className={`priority ${task.priority}`}>
                        {priorityLabels[task.priority] || "Orta"} Öncelik
                      </span>
                    </div>

                    <h3>{task.title}</h3>
                    <p>{task.description || "Açıklama eklenmedi."}</p>
                    <small>
                      👤 {task.assignee || "Atanmamış"}
                    </small>

                    <div className="task-actions">
                      <button onClick={() => editTask(task)}>
                        Düzenle
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => deleteTask(task.id)}
                      >
                        Sil
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>

        <footer>FitTrack © 2026 — Sağlıklı yaşam, düzenli takip.</footer>
      </main>
    </div>
  );
}

export default App;
