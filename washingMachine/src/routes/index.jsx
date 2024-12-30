import Root from "../components/Root";
import Home from "../components/Home";
import HomePage from "../views/HomePage";
import { createBrowserRouter } from "react-router-dom";
import BuildingPage from "../views/BuildingPage";
import MachinePage from "../views/MachinePage";

const router = createBrowserRouter(
    [
        {
            element: <Root />,
            children: [
                {
                    element: <Home />,
                    children: [
                        {
                            path: "/",
                            element: <HomePage />
                        },
                        {
                            path: "/home",
                            element: <HomePage />
                        },
                        {
                            path: "/building/:id",
                            element: <BuildingPage/>
                        },
                        {
                            path: "/machine/:id",
                            element: <MachinePage/>
                        }
                    ]
                }
            ]
        },
        
    ]
);

export default router;