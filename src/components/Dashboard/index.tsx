import { Outlet } from "react-router-dom";
import Header from "../Header"
import { Button, FloatButton, Form, Input } from "antd";
import { CustomerServiceOutlined } from '@ant-design/icons';
import { useContext, useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { AuthContext } from "../../contexts/authContext";
import { Loading } from "../Loading";
import { io } from "socket.io-client"

const socket = io('ws://localhost:3000', { transports: ['websocket'] });

const GET_MESSAGES = gql`
    query getMessages($userId: Int!){
        messages(userId: $userId){
            id,
            content,
            senderId,
            receiverId,
            createdAt
        }
    }
`;

const Dashboard = () => {
    const [messagesRender, setMessagesRender] = useState<any>([]);

    const [message, setMessage] = useState('');

    const user = useContext(AuthContext);
    const messages = useQuery(GET_MESSAGES, {
        variables: {
            userId: Number(user.id)
        }
    });

    useEffect(() => {
        if (!messages.loading && !messages.error) {
            setMessagesRender(messages.data.messages)
        }
    }, [messages.loading, messages.error])

    useEffect(() => {
        socket.on('onMessage', (payload) => {
            console.log(payload.content);
            setMessagesRender((prev: any) => [...prev, payload.content])
        })
    }, [])

    const ChatMessage = ({ message, isSender }: any) => {
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
            timeZone: 'Asia/Ho_Chi_Minh'
        };

        // @ts-ignore
        const createdAt = new Date(message.createdAt).toLocaleString('vi-VN', options);

        return (
            <div className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs p-3 rounded-lg ${isSender == null ? 'bg-gray-200 text-black' : 'bg-purple-200 text-black'}`}>
                    <p>{message.content}</p>
                    <span className="text-xs text-gray-500">{createdAt}</span>
                </div>
            </div>
        );
    };

    const handleSendMessage = () => {
        const content = message;
        const messageToSend = {
            content,
            senderId: user.id
        }
        setMessage('');
        socket.emit('message', JSON.stringify(messageToSend));
    }
    return <main>
        <Header />
        <div className="container mx-auto p-4 px-20">
            <Outlet />
        </div>
        <FloatButton.Group
            trigger="click"
            type="primary"
            style={{ left: 24 }}
            icon={<CustomerServiceOutlined />}
        >
            <div className="m-4 bg-white rounded-lg shadow-lg" style={{ height: "50rem", width: "40rem" }}>
                <div className="bg-red-600 text-white p-4 rounded-t-lg">
                    <h2 className="text-2xl">Chat with us</h2>
                </div>
                <div className="p-4 flex justify-between flex-col" style={{ height: "46rem" }}>
                    <div className="space-y-4 overflow-auto">
                        {
                            messages.error || messages.loading ? <Loading /> :
                                messagesRender.map((message: any, index: number) => (
                                    <ChatMessage key={index} message={message} isSender={message.senderId} />
                                ))}
                    </div>
                    <Form layout="vertical" className="mt-2">
                        <div className="flex">
                            <Input placeholder="message" value={message} onChange={(value) => { setMessage(value.currentTarget.value) }} />
                            <Button className="bg-red-600 text-white" onClick={handleSendMessage}>
                                Send
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
        </FloatButton.Group>
    </main >
}

export default Dashboard;
