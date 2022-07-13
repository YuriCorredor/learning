import Link from "next/link"
import { useRouter } from "next/router"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { CreateUserInput } from "../schema/user.schema"
import { trpc } from "../utils/trpc"

const VerifyToken = ({ hash }: { hash: string }) => {
    const { data, isLoading } = trpc.useQuery(["users.verify-otp", { hash }])
    const router = useRouter()

    if (isLoading) return <>Verifying...</>

    router.push(data?.redirect?.includes("login") ? "/" : data?.redirect || "/")

    return <></>
}

export default function LoginForm() {
    const router = useRouter()
    const [success, setSuccess] = useState(false)
    const { handleSubmit, register } = useForm<CreateUserInput>()

    const { mutate, error } = trpc.useMutation("users.request-otp", {
        onSuccess: () => {
            setSuccess(true)
        }
    })

    const onSubmit = (values: CreateUserInput) => {
        mutate({...values, redirect: router.asPath})
    }

    const hash = router.asPath.split("#token=")[1]
    if (hash) {
        return <VerifyToken hash={hash} />
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {error && error.message}
            {success && <p>Check your email!</p>}
            <h1>Login</h1>
            <input 
                type="email" 
                placeholder="Email" 
                {...register("email")}
            />
            <button type="submit">Login</button>
            <p>Does not have an account?</p>
            <Link href="/auth/register">Register</Link>
        </form>
    )
}
