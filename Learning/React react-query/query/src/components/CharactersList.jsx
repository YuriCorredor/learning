import { useState } from 'react'
import { useQuery } from 'react-query'
import CharactersItem from "./CharactersItem"

const fetchCharacters = async ({ queryKey }) => {
    const page = queryKey[1]
    const response = await fetch(`https://rickandmortyapi.com/api/character?page=${page}`)
    const data = await response.json()
    return data
}

export default function CharactersList() {
    const [page, setPage] = useState(42)
    const { data, isError, isLoading, error, isPreviousData } = useQuery(['characters', page], fetchCharacters, { 
        refetchOnWindowFocus: false,
        keepPreviousData: true
    })

    if (isLoading) return <h1>loading...</h1>
    if (isError) return <h1>error: {error.message}</h1>

    const scrollToTop = () => {
        window.scroll({top: 0, left: 0, behavior: 'smooth' })
    }
 
    return (
        <div className='grid grid-cols-1 lg:grid-cols-2'>
            {data.results.map(character => <CharactersItem key={character.id} character={character} />)}
            <button 
                className='p-2 m-2 rounded-md text-zinc-100 font-bold text-lg bg-zinc-500 disabled:bg-zinc-700' 
                disabled={page === 1 || isPreviousData}
                onClick={() => {
                    setPage(n => n - 1)
                    scrollToTop()
                }}
            >previous</button>
            <button 
                className='p-2 m-2 rounded-md text-zinc-100 font-bold text-lg bg-zinc-500 disabled:bg-zinc-700' 
                disabled={data.info.next === null || isPreviousData} 
                onClick={() => {
                    setPage(n => n + 1)
                    scrollToTop()
                }}
            >next</button>
        </div>
    )
}