import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io('http://localhost:3000');

export default function LobbyDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [lobby, setLobby] = useState<{
        name: string,
        players: Array<{ id: number, email: string }>,
    }|null>(null);

    const [message, setMessage] = useState('');
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');


    const fetchLobby = async() => {
        const response = await fetch(`http://localhost:3000/lobbies/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const data = await response.json();
        setLobby(data);
    }

    useEffect(() => { 
        fetchLobby() 

        socket.on('lobby.player.joined', event => {
            if (event.lobbyId.toString() === id) {
                setLobby(prev => ({
                    ...prev,
                    players: [...prev.players, { id: event.userId, email: event.email }]
                }));
            }
        })

        socket.on('lobby.player.left', event => {
            if (event.lobbyId.toString() === id) {
                setLobby(prev => ({
                    ...prev,
                    players: prev.players.filter(p => p.id !== event.userId)
                }));
            }
        })

        return () => {
            socket.off('lobby.player.joined');
            socket.off('lobby.player.left');
        }
    });

    const joinLobby = async() => {
        try {
            const response = await fetch(`http://localhost:3000/lobbies/${id}/join`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify({ userId: Number(userId) }),
            });

            if (response.ok) {
                setMessage('Joined lobby');
            } else {
                setMessage('Failed to join lobby');
            }
        } catch {
            setMessage('Error connecting to server');
        }
    }

    const leaveLobby = async() => {
        try {
            const response = await fetch(`http://localhost:3000/lobbies/${id}/leave`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify({ userId: Number(userId) }),
            });

            if (response.ok) {
                setMessage('Left lobby');
                navigate('/lobbies');
            } else {
                setMessage('Failed to leave lobby');
            }
        } catch {
            setMessage('Error connecting to server');
        }
    }

    if (!lobby) return <p>Loading...</p>;

    return(
        <div>
            <h1>{lobby.name}</h1>
            <p>Players:</p>
            <ul>
                {lobby.players.map(p => (
                    <li key={p.id}>{p.email}</li>
                ))}
            </ul>
            <div>
                <button onClick={joinLobby}>Join</button>
                <button onClick={leaveLobby}>Leave</button>
            </div>
            {message && <p>{message}</p>}
        </div>
    );
}