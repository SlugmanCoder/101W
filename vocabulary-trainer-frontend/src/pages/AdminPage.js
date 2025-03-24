// Updated AdminPage.js with improved modal design and Bulk Add

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css';

const AdminPage = () => {
  const [words, setWords] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingWord, setEditingWord] = useState(null);
  const [formData, setFormData] = useState({ word: '', definition: '', exampleSentence: '' });

  useEffect(() => {
    fetchWords();
  }, []);

  const fetchWords = async () => {
    try {
      const res = await axios.get('/api/vocabulary');
      setWords(res.data);
    } catch (error) {
      console.error('Error fetching words:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddClick = () => {
    setEditingWord(null);
    setFormData({ word: '', definition: '', exampleSentence: '' });
    setShowModal(true);
  };

  const handleEditClick = (wordObj) => {
    setEditingWord(wordObj);
    setFormData({
      word: wordObj.word,
      definition: wordObj.definition,
      exampleSentence: wordObj.exampleSentence || '',
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (editingWord) {
        await axios.put(`/api/vocabulary/${editingWord._id}`, formData);
      } else {
        await axios.post('/api/vocabulary', formData);
      }
      setShowModal(false);
      fetchWords();
    } catch (error) {
      console.error('Error saving word:', error);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Manage Vocabulary</h2>
        <div className="admin-controls">
          <button className="btn-filled" onClick={handleAddClick}>Add Word</button>
          <button className="btn-filled" style={{ marginLeft: '1rem' }}>Bulk Add</button>
        </div>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Word</th>
            <th>Definition</th>
            <th>Example</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {words.map((w) => (
            <tr key={w._id}>
              <td>{w.word}</td>
              <td>{w.definition}</td>
              <td>{w.exampleSentence}</td>
              <td>
                <button className="btn-outline" onClick={() => handleEditClick(w)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 style={{ marginBottom: '1rem' }}>{editingWord ? 'Edit Word' : 'Add New Word'}</h3>
            <div className="modal-form">
              <input
                type="text"
                name="word"
                placeholder="Word"
                value={formData.word}
                onChange={handleInputChange}
              />
              <textarea
                name="definition"
                placeholder="Definition"
                value={formData.definition}
                onChange={handleInputChange}
              />
              <textarea
                name="exampleSentence"
                placeholder="Example Sentence"
                value={formData.exampleSentence}
                onChange={handleInputChange}
              />
              <div className="modal-buttons">
                <button className="btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn-filled" onClick={handleSave}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;