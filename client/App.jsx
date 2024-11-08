import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

import TicketForm from './components/ticket_form';
import logo from '../public/logo.png';

function App() {
  return (
    <main>
      <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" /> 
              Simon's Patlytic Takehome
     </header>
      <Routes>
        <Route path = '/' element = {<TicketForm />} />
      </Routes>


    </main>
  );
}

export default App;
