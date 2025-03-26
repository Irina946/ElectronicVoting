import { Outlet, useLocation } from "react-router";
import { Header } from "./components/header/header";
import { Footer } from "./components/footer/footer";

export const Layout = () => {
    const location = useLocation();

    return (
        <>
            {location.pathname !== '/' && <Header />}
            <Outlet />
            {location.pathname !== '/' && <Footer />}
        </>
    )
}