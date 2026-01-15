import { useEffect, useState } from "react";
import "./index.css";

function App() {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");

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

  useEffect(load, []);

  return (
    <div className="container">
      <h1>TinyNote</h1>

      <div className="input-row">
        <input
          value={text}
          placeholder="Write a note…"
          onChange={e => setText(e.target.value)}
        />
        <button onClick={add}>Add</button>
      </div>

      {notes.map(n => (
        <div className="note" key={n.id}>{n.text}</div>
      ))}
    </div>
  );
}

export default App;
