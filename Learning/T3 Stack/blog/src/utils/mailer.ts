import nodemailer from "nodemailer"

export async function sendLoginEmail({ email, url, token }: {
    email: string,
    url: string,
    token: string
}) {
    const account = await nodemailer.createTestAccount()
    const transporter = await nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: account.user,
            pass: account.pass
        }
    })

    const info = await transporter.sendMail({
        from: '"T3 APP" <t3@example.com>',
        to: email,
        subject: "Login into T3 APP",
        html: `<h1>Login by clicking here: <a href="${url}/auth/login#token=${token}">login now</a></h1>`
    })

    console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`)
}