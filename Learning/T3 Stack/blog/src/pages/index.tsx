import React from "react"
import LoginForm from "../components/LoginForm"
import { useUserContext } from "../contexts/user.context"
import { trpc } from "../utils/trpc"

export default function index() {
    const user = useUserContext()

    if (!user) return <LoginForm />

    return (
        <div>Home Page</div>
    )
}
