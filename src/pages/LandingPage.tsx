import { Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";

export default function LandingPage() {
    const { toggleTheme } = useTheme();

    return (
        <div className="min-h-screen flex flex-col bg-main-100 text-main-700">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-main-200/80 backdrop-blur border-b-2 border-main-300">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <i className="bi bi-compass text-primary text-2xl" onClick={toggleTheme} />
                        </div>
                        <h1 className="text-xl font-semibold text-primary">Dira.me</h1>
                    </div>

                    <nav className="hidden md:flex gap-6 text-sm text-main-600">
                        <Link to="/auth/login" className="hover:text-primary">Login</Link>
                        <Link to="/auth/register" className="hover:text-primary">Register</Link>
                    </nav>
                </div>
            </header>


            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center text-center px-6">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-primary">
                    Your Personal Finance & Task Manager
                </h2>
                <p className="text-lg md:text-xl max-w-2xl mb-8 text-main-600">
                    Track your finances, manage your budget, and organize your tasks all in one place.
                    Take control of your money and time with Dira.me.
                </p>
                <div className="flex gap-4">
                    <Link to="/auth/register" className="px-6 py-3 bg-primary text-main-0 rounded-lg hover:bg-primary/90 transition">
                        Get Started
                    </Link>
                    <Link to="/auth/login" className="px-6 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary/10 transition">
                        Sign In
                    </Link>
                </div>
            </main>

            {/* Footer */}
            <footer id="contact" className="mt-auto">
                <div className="max-w-7xl mx-auto px-6 py-6 text-sm text-main flex justify-center items-center text-center">
                    <span>© {new Date().getFullYear()} Dira.me. All rights reserved.</span>
                </div>
            </footer>

        </div>
    );
}
