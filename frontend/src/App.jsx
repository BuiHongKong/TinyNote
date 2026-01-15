import { useEffect, useState } from "react";
import "./index.css";

function App() {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const load = () => {
    fetch("/notes")
      .then(r => r.json())
      .then(setNotes);
  };

  const add = () => {
    if (!text.trim()) return;
    fetch("/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    }).then(() => {
      setText("");
      load();
    });
  };

  const startEdit = (note) => {
    setEditingId(note.id);
    setEditText(note.text);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const saveEdit = (id) => {
    if (!editText.trim()) return;
    fetch(`/notes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: editText })
    }).then(() => {
      setEditingId(null);
      setEditText("");
      load();
    });
  };

  const deleteNote = (id) => {
    if (confirm("Are you sure you want to delete this note?")) {
      fetch(`/notes/${id}`, {
        method: "DELETE"
      }).then(() => {
        load();
      });
    }
  };

  useEffect(load, []);

  return (
    <div className="container">
      <h1>TinyNote</h1>

      <div className="input-row">
        <input
          value={text}
          placeholder="Write a note…"
          onChange={e => setText(e.target.value)}
          onKeyPress={e => e.key === "Enter" && add()}
        />
        <button onClick={add}>Add</button>
      </div>

      {notes.map(n => (
        <div className="note" key={n.id}>
          {editingId === n.id ? (
            <div className="note-edit">
              <input
                value={editText}
                onChange={e => setEditText(e.target.value)}
                onKeyPress={e => {
                  if (e.key === "Enter") saveEdit(n.id);
                  if (e.key === "Escape") cancelEdit();
                }}
                autoFocus
              />
              <div className="note-actions">
                <button onClick={() => saveEdit(n.id)} className="save-btn">Save</button>
                <button onClick={cancelEdit} className="cancel-btn">Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <div className="note-text">{n.text}</div>
              <div className="note-actions">
                <button onClick={() => startEdit(n)} className="edit-btn">Edit</button>
                <button onClick={() => deleteNote(n.id)} className="delete-btn">Delete</button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default App;
