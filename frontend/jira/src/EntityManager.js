import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EntityManager.css';

const EntityManager = ({ entityType }) => {
  const isUser = entityType === 'users';
  const apiUrl = isUser ? 'http://localhost:8082/api/users' : 'http://localhost:8081/api/tasks';

  const [data, setData] = useState([]);
  const [formData, setFormData] = useState(
    isUser
      ? { name: '', email: '' }
      : { title: '', description: '', dueDate: '', user: null }
  );
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchData();
    if (!isUser) fetchUsers();
  }, [entityType]);

  // Fetch data for the entity (Users or Tasks)
  const fetchData = async () => {
    try {
      const response = await axios.get(apiUrl);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Fetch users for the task dropdown (only needed for tasks)
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8082/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Handle Add or Update for both Users and Tasks
  const handleAddOrUpdate = async () => {
    try {
      const url = editingId ? `${apiUrl}/${editingId}` : apiUrl;
      const method = editingId ? 'put' : 'post';

      // Convert dueDate to epoch seconds (long value)
      const epochDueDate = formData.dueDate ? Date.parse(formData.dueDate) / 1000 : null;

      // Prepare payload for tasks with the full user object, not just the id
      const selectedUser = formData.user ? users.find((u) => u.id === parseInt(formData.user)) : null;

      const payload = isUser
        ? formData
        : {
            ...formData,
            dueDate: epochDueDate,  // Set dueDate as epoch seconds
            user: selectedUser || null,  // Set the full user object or null if no user selected
          };

      // Send the API request (POST for adding, PUT for updating)
      await axios[method](url, payload);

      // Refresh the data after adding/updating
      fetchData();

      // Reset the form and clear the editing state
      setFormData(isUser ? { name: '', email: '' } : { title: '', description: '', dueDate: '', user: null });
      setEditingId(null);
    } catch (error) {
      console.error('Error adding or updating:', error);
    }
  };

  // Handle delete operation for Users or Tasks
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  // Set form data to pre-fill for editing
  const startEdit = (item) => {
    setEditingId(item.id);
    setFormData(
      isUser
        ? { name: item.name, email: item.email }
        : { title: item.title, description: item.description, dueDate: new Date(item.dueDate * 1000).toISOString().split('T')[0], user: item.user ? item.user.id : '' }
    );
  };

  return (
    <div className="entity-manager">
      <h1>{isUser ? 'Manage Users' : 'Manage Tasks'}</h1>

      <div className="form">
        {/* Form for User or Task */}
        {isUser ? (
          <>
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
            {/* User dropdown for tasks */}
            <select
              value={formData.user || ''}
              onChange={(e) => setFormData({ ...formData, user: e.target.value })}
            >
              <option value="">Select User</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </>
        )}
        <button onClick={handleAddOrUpdate}>{editingId ? 'Update' : 'Add'}</button>
      </div>

      {/* List of Users or Tasks */}
      <div className="list">
        {data.map((item) => (
          <div key={item.id} className="list-item">
            <div className="details">
              {isUser ? (
                <>
                  <strong>{item.name}</strong> ({item.email})
                </>
              ) : (
                <>
                  <strong>{item.title}</strong> - {item.description} (Due: {new Date(item.dueDate * 1000).toLocaleDateString()})
                </>
              )}
            </div>
            <div className="actions">
              <button onClick={() => startEdit(item)}>Edit</button>
              <button onClick={() => handleDelete(item.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EntityManager;
