import Link from "next/link"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import { CreateUserInput } from "../../../schema/user.schema"
import { trpc } from "../../../utils/trpc"

export default function Register() {
    const router = useRouter()
    const { handleSubmit, register } = useForm<CreateUserInput>()

    const { mutate, error } = trpc.useMutation("users.register-user", {
        onSuccess: () => {
            router.push("/auth/login")
        }
    })

    const onSubmit = (values: CreateUserInput) => {
        mutate(values)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {error && error.message}
            <h1>Register</h1>
            <input 
                type="email" 
                placeholder="Email" 
                {...register("email")}
            />
            <input 
                type="text" 
                placeholder="Name" 
                {...register("name")}
            />
            <button type="submit">Register</button>
            <p>Already have an account?</p>
            <Link href="/auth/login">Login</Link>
        </form>
    )
}
