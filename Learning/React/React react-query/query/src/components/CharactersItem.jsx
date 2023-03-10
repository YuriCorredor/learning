export default function CharactersItem({ character }) {
    return (
        <div className="flex m-2 bg-zinc-900 rounded-lg text-zinc-300 shadow-lg hover:scale-105 transition-all">
            <img className="rounded-lg rounded-br-none rounded-tr-none min-w-[150px]" width={150} height={150} alt="character" src={character.image} />
            <div className="flex flex-col justify-between p-2">
                <div>
                    <h1 className="font-bold text-2xl">{character.name}</h1>
                    <span className="font-medium">{character.status} - {character.species}</span>
                </div>
                <div>
                    <p className="text-zinc-400 text-sm">Last know location:</p>
                    <span>{character.location.name}</span>
                </div>
            </div>
        </div>
    )
}
