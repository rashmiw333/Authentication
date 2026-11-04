import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

function App() {
  const handleGithubLogin = () => {
    window.location.href = "http://localhost:4000/auth/github"
  }

  return (
    <div className="App">
      <h1>OAuth Login</h1>

      <button onClick={handleGithubLogin}>
        Login with GitHub
      </button>
    </div>
  )
}

export default App