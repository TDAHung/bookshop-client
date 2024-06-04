import { Outlet } from "react-router-dom";
import Header from "../Header"

const Dashboard = () => {
    return <main>
        <Header />
        <div className="container mx-auto p-4 px-20">
            <Outlet />
        </div>
    </main>
}

export default Dashboard;
