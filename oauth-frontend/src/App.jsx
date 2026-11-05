
import './App.css'

function App() {
  const handleGithubLogin = () => {
    window.location.href = "http://localhost:4000/auth/github"
  }

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:4000/auth/google"
  }

  return (
    <div className="App">
      <h1>OAuth Login</h1>

      <button onClick={handleGithubLogin}>
        Login with GitHub
      </button>

      <br /><br />

      <button onClick={handleGoogleLogin}>
        Login with Google
      </button>
    </div>
  )
}

export default App
