import React from 'react';
import './App.css';
import { useState } from 'react';
import ImageForm from './components/ImageForm';

export default function App() {

    return (
        <div className="App">
            <header className="App-header">
                <h1>LaTeX 2 Speech</h1>
                <p>
                    Upload a LaTeX file (.tex) or image file (.png, .jpeg, .jpg)!
                </p>
                <ImageForm />
            </header>
        </div>
    );
}