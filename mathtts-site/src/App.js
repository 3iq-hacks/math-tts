import logo from './logo.svg';
import './App.css';
import {useState} from 'react';
import ImageForm from './components/ImageForm';

export default function App() {

  return (
    <div className="App">
      <header className="App-header">
        <h1>Math TTS</h1>
        <p>
          Math TTS is a web application that allows users to enter a math equation and have it read aloud.
        </p>
        <ImageForm />
      </header>
    </div>
  );
}