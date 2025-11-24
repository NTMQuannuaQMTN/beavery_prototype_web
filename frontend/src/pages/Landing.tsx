import { useEffect, useRef, useState } from 'react'
import reactLogo from '../assets/react.svg'
import beaveryLogo from '/beavery.svg'
import '../App.css'

function Landing() {
    // Chat form states
    type Message = { id: string; role: 'user' | 'assistant'; text: string }
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    async function handleSubmit(e?: React.FormEvent) {
        e?.preventDefault()
        const trimmed = input.trim()
        if (!trimmed) return

        const userMsg: Message = { id: String(Date.now()), role: 'user', text: trimmed }
        setMessages((m) => [...m, userMsg])
        setInput('')
        setLoading(true)

        try {
            // Replace /api/chat with your backend endpoint that proxies to OpenAI or similar.
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: trimmed }),
            })

            if (!res.ok) {
                throw new Error(`Server error ${res.status}`)
            }

            const data = await res.json()
            // Expecting { reply: string } from the API; adjust as needed.
            const assistantText = data?.reply ?? 'No response'
            const assistantMsg: Message = { id: String(Date.now() + 1), role: 'assistant', text: assistantText }
            setMessages((m) => [...m, assistantMsg])
        } catch (err) {
            const errorMsg: Message = {
                id: String(Date.now() + 2),
                role: 'assistant',
                text: `Error: ${(err as Error).message}`,
            }
            setMessages((m) => [...m, errorMsg])
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div className='w-screen h-full justify-center items-center flex-col'>
                <h1 className='text-4xl font-bold text-[#0D2755]'>WELCOME TO BEAVERY</h1>
                <div className='flex flex-col justify-start items-start mt-4 gap-2 rounded-lg border-2 border-[#0D2755] p-2 mx-4'>
                    <h2 className='text-lg text-[#0D2755]'>What would you like to look for today?</h2>
                    <input className='mx-auto bg-white w-[98%] text-black p-1'></input>
                </div>
            </div>
        </>
    )
}

export default Landing