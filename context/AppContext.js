import React, { useState } from "react";

const AppContext = React.createContext();

export const AppProvider = ({ children }) => {

    const [players, setPlayers] = useState([])
    const [userName, setUserName] = useState('');
    return (
        <AppContext.Provider value={{ userName, setUserName, players, setPlayers }}>
            {children}
        </AppContext.Provider>
    )

}

export default AppContext