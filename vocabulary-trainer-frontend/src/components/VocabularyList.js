import React, { useEffect, useState } from 'react';

const VocabularyList = () => {
  const [words, setWords] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5001/api/vocabulary')
      .then(res => res.json())
      .then(data => setWords(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Vocabulary List</h2>
      <ul>
        {words.map(word => (
          <li key={word._id}>
            <strong>{word.word}</strong>: {word.definition}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VocabularyList;  // <-- ensure this line exists exactly like this
