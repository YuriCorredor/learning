import React, { createContext, useContext } from "react"

const UserContext = createContext(null)

const UserContextProvider = ({children, value}: {
    children: React.ReactNode,
    value: any
}) => {
    return <UserContext.Provider value={value} >{children}</UserContext.Provider>
}

const useUserContext = () => useContext(UserContext)

export { useUserContext, UserContextProvider }
