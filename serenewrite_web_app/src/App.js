import React from 'react';
import './App.css';
import MainContainer from './components/MainContainer';

/**
 * App is the root of the SereneWrite web app.
 */
function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div className="logo">
              <span className="logo-symbol">*</span> SereneWrite
            </div>
            {/* Navbar right placeholder - can be extended if needed */}
          </div>
        </div>
      </nav>
      <main>
        <MainContainer />
      </main>
    </div>
  );
}

export default App;