import 'server-only'

const dictionaries = {
    en: () => import('@/dictionaries/en.json').then((module) => module.default),
    ru: () => import('@/dictionaries/ru.json').then((module) => module.default),
}

export const getDictionary = async (locale: 'en' | 'ru') => {
    // Default to 'en' if the locale is not directly found (safety check)
    if (!dictionaries[locale]) {
        return dictionaries['en']()
    }
    return dictionaries[locale]()
}
