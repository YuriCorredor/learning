import logo from "./assets/images/logo.png"
import CharactersList from "./components/CharactersList"

export default function App() {
    return (
    <main className="flex flex-col w-full bg-zinc-200 items-center min-h-screen">
        <header className="flex w-full absolute bg-zinc-100 shadow-lg border-b-2 p-2">
            <img alt="logo" width={200} height={64} src={logo} />
        </header>
        <div className="flex w-full max-w-7xl justify-center pt-24 px-4">
            <CharactersList />
        </div>
        <footer className="flex justify-center w-full self-end bg-zinc-100 p-6 mt-6">
            <p className="text-xs font-bold text-zinc-800">© Copyright | Yuri Corredor</p>
        </footer>
    </main>
    )
}
