import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingDescription, setEditingDescription] = useState("");

  const fetchTodos = async () => {
    const res = await axios.get("http://localhost:8080/api/todos");
    setTodos(res.data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async () => {
    if (!title) return;

    await axios.post("http://localhost:8080/api/todos", {
      title,
      description,
      completed: false,
    });

    setTitle("");
    setDescription("");

    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await axios.delete(`http://localhost:8080/api/todos/${id}`);
    fetchTodos();
  };


const toggleCompleted = async (todo) => {
  try {
    const updatedTodo = {
      ...todo,
      completed: !todo.completed,
    };

    await axios.put(
      `http://localhost:8080/api/todos/${todo.id}`,
      updatedTodo
    );

    fetchTodos();

  } catch (error) {
    console.error("Checkbox update failed:", error);
  }
};

  const startEdit = (todo) => {
  setEditingId(todo.id);
  setEditingTitle(todo.title);
  setEditingDescription(todo.description || "");
};

const saveEdit = async (id) => {
  const currentTodo = todos.find((t) => t.id === id);

  await axios.put(`http://localhost:8080/api/todos/${id}`, {
    title: editingTitle,
    description: editingDescription,
    completed: currentTodo.completed,
  });

  setEditingId(null);
  fetchTodos();
};



return (
  <div style={styles.container}>
    <div style={styles.card}>

      <h1 style={styles.heading}>Todo App</h1>

      <div style={styles.inputContainer}>
        <input
          style={styles.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
        />

        <input
          style={styles.input}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description"
        />

        <button type="button" style={styles.primaryBtn} onClick={addTodo}>
          + Add Task
        </button>
      </div>

      <div style={styles.taskList}>
        {todos.map((todo) => (
  <div key={todo.id} style={styles.taskItem}>

    {editingId === todo.id ? (

      <>
        <div style={{ flex: 1, display: "flex", gap: "10px" }}>
          <input
            style={styles.input}
            value={editingTitle}
            onChange={(e) => setEditingTitle(e.target.value)}
          />
          <input
            style={styles.input}
            value={editingDescription}
            onChange={(e) => setEditingDescription(e.target.value)}
          />
        </div>

        <button
          type="button"
          style={styles.primaryBtn}
          onClick={() => saveEdit(todo.id)}
        >
          Save
        </button>
      </>

    ) : (

      <>
        <div style={styles.leftSection}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => toggleCompleted(todo)}
            style={styles.checkbox}
          />

          <div>
            <div
              style={{
                ...styles.taskTitle,
                textDecoration: todo.completed
                  ? "line-through"
                  : "none",
                opacity: todo.completed ? 0.6 : 1,
              }}
            >
              {todo.title}
            </div>

            {todo.description && (
              <div style={styles.taskDescription}>
                {todo.description}
              </div>
            )}
          </div>
        </div>

        <div style={styles.actionButtons}>
          <button
            type="button"
            style={styles.editBtn}
            onClick={() => startEdit(todo)}
          >
            Edit
          </button>

          <button
            type="button"
            style={styles.deleteBtn}
            onClick={() => deleteTodo(todo.id)}
          >
            Delete
          </button>
        </div>
      </>
    )}

  </div>
))}


      </div>

    </div>
  </div>
);
}

const styles = {
  container: {
    height: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #1e3c72, #2a5298)",
    fontFamily: "Segoe UI, sans-serif",
  },

  card: {
    background: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(20px)",
    padding: "40px",
    borderRadius: "20px",
    width: "90%",
    maxWidth: "650px",
    boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
  },

  heading: {
    textAlign: "center",
    color: "#fff",
    marginBottom: "30px",
    fontWeight: "600",
    letterSpacing: "1px",
  },

  inputContainer: {
    display: "flex",
    gap: "12px",
    marginBottom: "30px",
  },

  input: {
    flex: 1,
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    outline: "none",
    fontSize: "14px",
  },

  primaryBtn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "12px 20px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "500",
    transition: "0.3s",
  },

  taskList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  taskItem: {
    background: "rgba(255,255,255,0.9)",
    padding: "15px 20px",
    borderRadius: "14px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    transition: "0.3s",
  },

  leftSection: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },

  checkbox: {
    width: "18px",
    height: "18px",
    cursor: "pointer",
  },

  taskTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#1e293b",
  },

  taskDescription: {
    fontSize: "13px",
    color: "#64748b",
  },

  actionButtons: {
    display: "flex",
    gap: "10px",
  },

  editBtn: {
    background: "#facc15",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "500",
  },

  deleteBtn: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "500",
  },
};


export default App;
