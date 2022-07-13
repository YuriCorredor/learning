import { PrismaClientKnownRequestError } from "@prisma/client/runtime"
import { createUserSchema, requestOtpSchema, veriftOtpSchema } from "../../schema/user.schema"
import { createRouter } from "../createRouter"
import * as trpc from "@trpc/server"
import { sendLoginEmail } from "../../utils/mailer"
import { base_url } from "../../constants"
import { decode, encode } from "../../utils/base64"
import { singJwt } from "../../utils/jwt"
import { serialize } from "cookie"

export const userRouter = createRouter()
.mutation('register-user', {
    input: createUserSchema,
    resolve: async ({ ctx, input }) => {
        const { email, name } = input
        try {
            const user = await ctx.prisma.user.create({
                data: {
                    email,
                    name
                }
            })
    
            return user
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    throw new trpc.TRPCError({
                        code: "CONFLICT",
                        message: "User already exists."
                    })
                }
            }

            throw new trpc.TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Something went wrong!"
            })
        }
        
    }
})
.mutation('request-otp', {
    input: requestOtpSchema,
    resolve: async ({ ctx, input }) => {
        const { email, redirect } = input

        const user = await ctx.prisma.user.findUnique({
            where: {
                email
            }
        })

        if (!user) throw new trpc.TRPCError({
            code: "NOT_FOUND",
            message: "User not found."
        })

        const token = await ctx.prisma.loginToken.create({
            data: {
                redirect,
                user: {
                    connect: {
                        id: user.id
                    }
                }
            }
        })

        await sendLoginEmail({
            token: encode(`${token.id}:${user.email}`),
            url: base_url,
            email: user.email
        })

        return true
    }
})
.query('verify-otp', {
    input: veriftOtpSchema,
    resolve: async ({ ctx, input }) => {
        const [id, email] = decode(input.hash).split(":")

        const token = await ctx.prisma.loginToken.findFirst({
            where: {
                id,
                user: {
                    email
                }
            },
            include: {
                user: true
            }
        })

        if (!token) {
            throw new trpc.TRPCError({
                code: "FORBIDDEN",
                message: "Invalid token."
            })
        }

        const jwt = singJwt({
            email: token.user.email,
            id: token.user.id
        })

        ctx.res.setHeader("Set-Cookie", serialize("jwtoken", jwt, { path: "/" }))

        return {
            redirect: token.redirect
        }
    }
})
.query('me', {
    resolve: ({ ctx }) => {
        return ctx.user
    }
})