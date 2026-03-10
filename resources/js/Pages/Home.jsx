import { Link } from '@inertiajs/react'
import { useState } from 'react'

export default function Home() {
    const [count, setCount] = useState(0)

    return (
        <div>
            <h1>Laravel + Inertia + React fonctionne !</h1>
            <h2>{count}</h2>
            <button onClick={() => setCount(count + 1)}>+1</button>
            <Link href={`/oeoeoe?count=${count}`}>OEOEOE</Link>
        </div>
    )
}