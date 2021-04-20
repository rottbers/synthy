import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { NotesProvider } from './contexts/Notes';
import { SettingsProvider } from './contexts/Settings';
import './tailwind.css';

ReactDOM.render(
  <React.StrictMode>
    <SettingsProvider>
      <NotesProvider>
        <App />
      </NotesProvider>
    </SettingsProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
