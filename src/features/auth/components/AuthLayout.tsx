import { Link, Outlet } from "react-router-dom";

export default function AuthLayout() {
    return (
        <div className="flex min-h-screen bg-main-100">
            {/* Left Column — Image Section */}
            <div className="relative hidden md:flex md:w-1/2 items-center justify-center overflow-hidden">
                <Link
                    to="/"
                    className="absolute top-4 left-4 flex items-center gap-2 text-primary font-bold text-xl"
                >
                    <i className="bi bi-compass text-4xl"></i>
                    <span>Inv.max</span>
                </Link>

                <img
                    src={`${import.meta.env.BASE_URL}payment-cover.png`}
                    alt="Auth Cover"
                    className="w-full max-w-137.5 p-10 object-contain"
                />
            </div>

            {/* Right Column — Form Section */}
            <div className="relative bg-main-200 flex w-full md:w-1/2 flex-col">
                {/* Home Icon */}
                <div className="absolute top-4 right-4 z-10">
                    <Link to="/">
                        <i className="bi bi-house fs-4 text-primary" />
                    </Link>
                </div>

                <div className="mx-auto w-full max-w-175 px-4 flex items-center justify-center min-h-screen">
                    <div className="w-full max-w-md">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
}
