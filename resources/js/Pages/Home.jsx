import { Link} from '@inertiajs/react'
import { useState } from 'react'
import { router } from '@inertiajs/react';
export default function Home() {
    const [count, setCount] = useState(0)

    return (
        <div>
            <h1>Laravel + Inertia + React fonctionne !</h1>
            <h2>{count}</h2>
            <button
                onClick={() => router.get(route('login'))}
                className="px-4 py-2 bg-red-600 text-white rounded"
            >
                Login
            </button>
            <button onClick={() => setCount(count + 1)}>+1</button>
            <Link href={`/oeoeoe?count=${count}`}>OEOEOE</Link>
        </div>
    )
}