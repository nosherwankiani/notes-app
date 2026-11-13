import { useState } from 'react';

const Note = ({ note, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    // Wait for the slide-out animation to finish (300ms) before removing from state
    setTimeout(() => {
      onDelete(note.id);
    }, 300); 
  };

  return (
    <div className={`note-card ${isDeleting ? 'slide-out' : 'fade-in'}`}>
      <p className="note-text">{note.text}</p>
      <div className="note-footer">
        <span className="note-date">{note.date}</span>
        <button onClick={handleDelete} className="delete-btn" aria-label="Delete note">🗑️</button>
      </div>
    </div>
  );
};

export default Note;
