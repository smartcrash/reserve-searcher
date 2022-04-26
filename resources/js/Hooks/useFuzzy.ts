import FuzzySearch from 'fuzzy-search'
import { useMemo, useState } from 'react'

function useFuzzy<T extends string | object>(items: T[], keys: string[]) {
    const [result, setResult] = useState<T[]>([])
    const searcher = useMemo(
        () =>
            new FuzzySearch(items, keys as string[], {
                caseSensitive: false,
                sort: true,
            }),
        [items, keys]
    )

    const search = (needle: string) => {
        const _result = searcher.search(needle)
        setResult(_result)
    }

    return { result, search }
}

export default useFuzzy
