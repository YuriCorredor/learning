import Header from './Header'
import AddContact from './AddContact'
import ContactList from './ContactList'

export default function App() {
    return (
        <main className='flex flex-col w-full h-full'>
            <Header />
            <AddContact />
            <ContactList />
        </main>
    )
}