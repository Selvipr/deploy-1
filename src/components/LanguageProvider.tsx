'use client'

import { createContext, useContext } from 'react'

// Define the type for our dictionary (or a subset of it)
// basic type safety helps
type Dictionary = Record<string, any>

const LanguageContext = createContext<Dictionary | null>(null)

export default function LanguageProvider({
    dictionary,
    children,
}: {
    dictionary: Dictionary
    children: React.ReactNode
}) {
    return (
        <LanguageContext.Provider value={dictionary}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useDictionary() {
    const dictionary = useContext(LanguageContext)
    if (dictionary === null) {
        throw new Error('useDictionary must be used within a LanguageProvider')
    }
    return dictionary
}
