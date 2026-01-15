/* ===============================
   LANGUAGE REDIRECT WITH COOKIE
   =============================== */

(function () {
    const COOKIE_NAME = 'site_lang'
    const COOKIE_DAYS = 365

    const supportedLangs = ['it', 'en']

    const pathParts = location.pathname.split('/').filter(Boolean)
    const currentLang = pathParts[0] || ''
    const isRoot = pathParts.length < 1

    // COOKIE HELPERS
    function getCookie(name) {
        return document.cookie
            .split('; ')
            .find(row => row.startsWith(name + '='))
            ?.split('=')[1]
    }

    function setCookie(name, value, days) {
        const expires = new Date(Date.now() + days * 864e5).toUTCString()
        document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`
    }

    // 1. COOKIE FIRST
    const savedLang = getCookie(COOKIE_NAME)
    let selectedLang = 'en'

    if (savedLang && supportedLangs.includes(savedLang)) {
        selectedLang = savedLang
    } else {
        // 2. BROWSER DETECTION
        const browserLangs = navigator.languages || [navigator.language]

        for (const entry of browserLangs) {
            const [lang, region] = entry.toLowerCase().split('-')
            const upperRegion = region?.toUpperCase()

            if (supportedLangs.includes(lang)) {
                selectedLang = lang
                break
            }
        }

        // salva la lingua determinata
        setCookie(COOKIE_NAME, selectedLang, COOKIE_DAYS)
    }

    // 3. REDIRECT SOLO SE NECESSARIO
    if (currentLang !== selectedLang) {
        const destPath = isRoot
            ? `/${selectedLang}/`
            : `/${selectedLang}/${pathParts.slice(1).join('/')}`

        location.replace(destPath)
    }
})()