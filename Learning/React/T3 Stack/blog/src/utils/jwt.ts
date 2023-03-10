import jwt from "jsonwebtoken"

const SECRET = process.env.SECRET || "secret"

export const singJwt = (data: object) => {
    return jwt.sign(data, SECRET)
}

export const verifyJwt = <T>(token: string) => {
    return jwt.verify(token, SECRET) as T
}