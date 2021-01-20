import React from 'react';

import '../css/App.css';
import logo from '../assets/slice.png';
import { RepoDisplay } from './RepoDisplay';

export function App() {
  return (
    <div className="App">
      <img src={logo} alt="silverorange" />
      <br />
      <RepoDisplay />
    </div>
  );
}
