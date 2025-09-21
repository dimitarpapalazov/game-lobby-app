import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io('http://localhost:3000');

export default function Lobbies() {
    const [lobbies, setLobbies] = useState<{ 
        id: number,
        name: string,
        players: Array<{ id: number, email: string }>,
    }[]>([]);

    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    const fetchLobbies = async() => {
        const response = await fetch('http://localhost:3000/lobbies', {
            headers: { Authorization: `Bearer ${token}` }
        });

        const data = await response.json();
        setLobbies(data);
    }

    useEffect(() => { 
        fetchLobbies();

        socket.on('lobby.created', event => {
            setLobbies(prev => [...prev, { id: event.lobbyId, name: event.name, players: [] }]);
        });

        socket.on('player.joined', event => {
            setLobbies(prev => {
                return prev.map(lobby => {
                    if (lobby.id === event.lobbyId) {
                        return { ...lobby, players: [...lobby.players, { id: event.userId, email: event.email }] };
                    } else {
                        return lobby;
                    }
                })
            })
        });

        socket.on('lobby.player.left', event => {
            setLobbies(prev => {
                return prev.map(lobby => {
                    if (lobby.id === event.lobbyId) {
                        return { ...lobby, players: lobby.players.filter(player => player.id !== event.userId) };
                    } else {
                        return lobby;
                    }
                })
            })
        });

        return () => {
            socket.off('lobby.created');
            socket.off('player.joined');
            socket.off('lobby.player.left');
        }
    });

    const createLobby = async(e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3000/lobbies/create', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify({ name, creatorId: Number(userId) }),
            });

            if (response.ok) {
                setMessage('Lobby created');
                setName('');
            } else {
                setMessage('Failed to create lobby');
            }
        } catch {
            setMessage('Error connecting to server');
        }
    }

    return(
        <div>
            <h1>Game Lobbies</h1>
            {/* Create lobby form */}
            <form onSubmit={createLobby}>
                <input
                    type="text"
                    placeholder="Lobby name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <button>Create</button>
            </form>
            {message && <p>{message}</p>}

            {/* List lobbies */}
            <ul>
                {lobbies.map(lobby => (
                    <li key={lobby.id}>
                        <div>
                            <span>{lobby.name} ({lobby.players.length} players)</span>
                            <Link to={`/lobbies/${lobby.id}`}>View</Link>
                        </div>
                    </li>
                ))}
            </ul>
        </div>

    )
}