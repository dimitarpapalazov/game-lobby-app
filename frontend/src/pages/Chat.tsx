import { useEffect, useRef, useState } from "react";
import { getSocket } from "../services/socket.ts";

type ChatMessage = {
    id: number;
    sender: { id: number, email?: string };
    content: string;
    createdAt: string;
}

type Props = {
    lobbyId: number | string;
}

export default function Chat({ lobbyId }: Props) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const socket = getSocket();
    const token = localStorage.getItem('token');
    const userId = Number(localStorage.getItem('userId'));

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
        
        fetch(`${URL}/chat/${lobbyId}`, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(async res => {
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body.message || 'Failed to fetch messages');
            }

            return res.json();
        }).then((data: ChatMessage[]) => {
            if (!mounted) {
                return;
            }

            setMessages(data);
            setTimeout(scrollToBottom, 50);
        }).catch((err) => {
            console.error('Chat load error:', err);
        }).finally(() => {
            if (mounted) {
                setLoading(false);
            }
        });

        return () => {
            mounted = false;
        };
    }, [lobbyId, token]);

    useEffect(() => {
        if (!socket) {
            return;
        }

        const eventName = `chat.message.${lobbyId}`;

        const handler = (payload: any) => {
            const message: ChatMessage = {
                id: payload.id ?? Date.now(),
                content: payload.content,
                createdAt: payload.createdAt || new Date().toISOString(),
                sender: payload.sender || { id: payload.userId, email: payload.senderEmail },
            };

            setMessages((prev) => {
                const next = [...prev, message].slice(-200);
                return next;
            });

            setTimeout(scrollToBottom, 20);
        };

        socket.on(eventName, handler);

        return () => {
            socket.off(eventName, handler);
        };
    }, [socket, lobbyId]);

    const sendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();

        if (!text.trim()) {
            return;
        }

        setSending(true);

        const optimistic: ChatMessage = {
            id: Date.now(),
            content: text,
            createdAt: new Date().toISOString(),
            sender: { id: userId, email: undefined },
        };

        setMessages((prev) => [...prev, optimistic]);
        setText('');
        setTimeout(scrollToBottom, 20);

        try {
            const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

            const res = await fetch(`${URL}/chat/${lobbyId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ content: optimistic.content, userId: Number(userId) }),
            });

            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body.message || 'Failed to send message');
            }

            const saved: ChatMessage = await res.json();

            setMessages((prev) => {
                const replaced = prev.map((m) => (m.id === optimistic.id ? saved : m))
                return replaced.slice(-200); 
            });
        } catch (err) {
            console.error('send failed:', err);

            setMessages((prev) => 
                prev.map((m) => 
                    m.id === optimistic.id ? { ...m, content: m.content + ' (failed to send)' } : m
                )
            );
        } finally {
            setSending(false);
        }
    };

    return(
        <div>
            <div ref={scrollRef}>
                { loading ? (
                    <p>Loading messages...</p>
                ) : setMessages.length === 0 ? (
                    <p>No messages yet - be the first!</p>
                ) : (
                    <div>
                        {messages.map((m) => (
                            <div key={m.id} className="chat-message">
                                <div className="chat-message-content">{m.content}</div>
                                <div className="chat-message-sender">{m.sender.email ?? `User ${m.sender.id}`} • {new Date(m.createdAt).toLocaleString()}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <form onSubmit={sendMessage}>
                <input 
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    disabled={sending}
                />
                <button 
                    type="submit"
                    disabled={sending}
                >
                    Send
                </button>
            </form>
        </div>
    )
}