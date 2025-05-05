import { memo, useMemo } from "react";
import { Outlet, useLocation } from "react-router";
import { Header } from "./components/header/header";
import { Footer } from "./components/footer/footer";

// Мемоизированные компоненты Header и Footer
const MemoizedHeader = memo(Header);
const MemoizedFooter = memo(Footer);

export const Layout = memo(() => {
    const location = useLocation();
    
    // Мемоизируем значение, чтобы не пересчитывать при каждом рендере
    const shouldShowHeaderFooter = useMemo(() => {
        return location.pathname !== '/';
    }, [location.pathname]);

    return (
        <>
            {shouldShowHeaderFooter && <MemoizedHeader />}
            <Outlet />
            {shouldShowHeaderFooter && <MemoizedFooter />}
        </>
    );
});