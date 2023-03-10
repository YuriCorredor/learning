import dynamic from "next/dynamic"

const LoginForm = dynamic(() => import("../../../components/LoginForm"), {
    ssr: false
})

export default function LoginPage() {
    return <LoginForm />
}
