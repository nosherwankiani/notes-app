import { useState, useEffect } from 'react';
import Masonry from 'react-masonry-css';
import Note from './components/Note';
import './index.css';

function App() {
  // 1. React State Management: Initialize notes from Local Storage
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('react-notes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);

  // 2. Working with Browser localStorage: Save notes whenever they change
  useEffect(() => {
    localStorage.setItem('react-notes', JSON.stringify(notes));
  }, [notes]);

  // Add a new note
  const addNote = (e) => {
    e?.preventDefault(); // Prevent page reload on form submit
    if (!inputText.trim()) return; // Don't add empty notes
    
    const newNote = {
      id: Date.now().toString(),
      text: inputText,
      date: new Date().toLocaleDateString()
    };
    
    setNotes([newNote, ...notes]);
    setInputText('');
  };

  // Delete a note
  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  // 3. Challenge: Native Web Speech API for Voice-to-Text
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  const toggleListening = () => {
    if (!recognition) {
      alert("Your browser doesn't support speech recognition. Try using Chrome.");
      return;
    }
    
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  // Handle voice recognition results
  if (recognition) {
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      // Append dictated text to whatever is currently in the textbox
      setInputText(prev => prev ? prev + ' ' + transcript : transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
  }

  // Masonry grid responsive breakpoints
  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  return (
    <div className="app-container">
      <header>
        <h1>Smart Notes 📝</h1>
      </header>
      
      <form onSubmit={addNote} className="note-form">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your note here or click 'Dictate'..."
          rows="3"
        />
        <div className="controls">
          <button 
            type="button" 
            onClick={toggleListening}
            className={`mic-btn ${isListening ? 'listening' : ''}`}
          >
            {isListening ? '🛑 Stop' : '🎤 Dictate'}
          </button>
          <button type="submit" className="add-btn">Add Note</button>
        </div>
      </form>

      {/* Masonry Grid Layout */}
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {notes.map(note => (
          <Note key={note.id} note={note} onDelete={deleteNote} />
        ))}
      </Masonry>
    </div>
  );
}

export default App;
