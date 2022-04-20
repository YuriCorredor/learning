import { useState } from "react"

export default function Login() {

    const [error, setError] = useState(false)
    const [username, setUsername] = useState("")
    const [loading, setLoading] = useState(false)
    const [password, setPassword] = useState("")
    const [user, setUser] = useState({})

    const handleClick = async e => {
        e.preventDefault()
        setLoading(true)
        try {
            const response = await fetch("https://jsonplaceholder.typicode.com/users/1")
            if (response.status == 200) {
                const userData = await response.json()
                setUser(userData)
            }
        } catch {
            setError(true)
        }
        setLoading(false)
    }

    return (
        <div>
            <span>{user.name}</span>
            <form>
                <input type='text' placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)}/>
                <input type='password' placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                <button onClick={handleClick} disabled={!username || !password}>{loading ? 'Wait...' : 'login'}</button>
                <span style={{visibility: error ? 'visible' : 'hidden'}} data-testid="error">Something went wrong!</span>
            </form>
        </div>
    )
}