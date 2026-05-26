import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/axios'

function Dashboard() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState('medium')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const name = localStorage.getItem('name')

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const res = await API.get('/tasks')
      setTasks(res.data)
    } catch (err) {
      setError('Failed to fetch tasks')
    }
  }

  const handleCreateTask = async (e) => {
    e.preventDefault()
    try {
      const res = await API.post('/tasks', { title, description, dueDate, priority })
      setTasks([res.data, ...tasks])
      setTitle('')
      setDescription('')
      setDueDate('')
      setPriority('medium')
    } catch (err) {
      setError('Failed to create task')
    }
  }

  const handleComplete = async (task) => {
    try {
      const res = await API.put(`/tasks/${task._id}`, { completed: !task.completed })
      setTasks(tasks.map(t => t._id === task._id ? res.data : t))
    } catch (err) {
      setError('Failed to update task')
    }
  }

  const handleDelete = async (id) => {
    try {
      await API.delete(`/tasks/${id}`)
      setTasks(tasks.filter(t => t._id !== id))
    } catch (err) {
      setError('Failed to delete task')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('name')
    navigate('/login')
  }

  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
        <h2 style={styles.navTitle}>Task Manager</h2>
        <div>
          <span style={styles.welcome}>Welcome, {name}!</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.formBox}>
          <h3 style={styles.formTitle}>Add New Task</h3>
          {error && <p style={styles.error}>{error}</p>}
          <form onSubmit={handleCreateTask}>
            <input
              style={styles.input}
              type="text"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <input
              style={styles.input}
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              style={styles.input}
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
            <select
              style={styles.input}
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <button style={styles.button} type="submit">Add Task</button>
          </form>
        </div>

        <div style={styles.taskList}>
          <h3 style={styles.formTitle}>My Tasks ({tasks.length})</h3>
          {tasks.length === 0 && <p style={styles.noTasks}>No tasks yet. Add one above!</p>}
          {tasks.map(task => (
            <div key={task._id} style={{
              ...styles.taskCard,
              opacity: task.completed ? 0.6 : 1
            }}>
              <div style={styles.taskHeader}>
                <h4 style={{
                  ...styles.taskTitle,
                  textDecoration: task.completed ? 'line-through' : 'none'
                }}>
                  {task.title}
                </h4>
                <span style={{
                  ...styles.badge,
                  backgroundColor: task.priority === 'high' ? '#fee2e2' :
                    task.priority === 'medium' ? '#fef9c3' : '#dcfce7',
                  color: task.priority === 'high' ? '#dc2626' :
                    task.priority === 'medium' ? '#ca8a04' : '#16a34a'
                }}>
                  {task.priority}
                </span>
              </div>
              {task.description && <p style={styles.taskDesc}>{task.description}</p>}
              {task.dueDate && (
                <p style={styles.taskDate}>
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </p>
              )}
              <div style={styles.taskActions}>
                <button
                  style={{
                    ...styles.completeBtn,
                    backgroundColor: task.completed ? '#6b7280' : '#4f46e5'
                  }}
                  onClick={() => handleComplete(task)}
                >
                  {task.completed ? 'Undo' : 'Complete'}
                </button>
                <button
                  style={styles.deleteBtn}
                  onClick={() => handleDelete(task._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f0f2f5' },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4f46e5',
    padding: '15px 30px',
    color: 'white'
  },
  navTitle: { margin: 0 },
  welcome: { marginRight: '15px' },
  logoutBtn: {
    padding: '8px 16px',
    backgroundColor: 'white',
    color: '#4f46e5',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  content: {
    maxWidth: '800px',
    margin: '30px auto',
    padding: '0 20px'
  },
  formBox: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginBottom: '30px'
  },
  formTitle: { marginBottom: '20px', color: '#333' },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    fontSize: '16px',
    boxSizing: 'border-box'
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer'
  },
  error: { color: 'red', marginBottom: '10px' },
  taskList: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  noTasks: { color: '#888', textAlign: 'center' },
  taskCard: {
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '15px'
  },
  taskHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  taskTitle: { margin: 0, color: '#333' },
  badge: {
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  taskDesc: { color: '#666', fontSize: '14px', margin: '5px 0' },
  taskDate: { color: '#888', fontSize: '13px', margin: '5px 0' },
  taskActions: { display: 'flex', gap: '10px', marginTop: '10px' },
  completeBtn: {
    padding: '6px 14px',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  deleteBtn: {
    padding: '6px 14px',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  }
}

export default Dashboard