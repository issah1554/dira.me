import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/Buttons";
import { TextInput } from "../../../components/ui/TextInput";

interface LoginFormProps {
    onLogin: (email: string, password: string) => Promise<unknown> | void;
    loading?: boolean;
    error?: string;
}

export default function LoginForm({ onLogin, loading = false, error }: LoginFormProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        await onLogin(email, password);
    };

    return (
        <div className="bg-transparent p-4 md:p-6 rounded-lg animation-zoom-in">
            <div className="space-y-4">
                {error && (
                    <div className="bg-danger-100 text-danger-700 px-4 py-2 rounded" role="alert">
                        {error}
                    </div>
                )}

                <form className="grid gap-4">
                    <TextInput
                        label="Email Address"
                        labelBgColor="bg-main-200"
                        type="email"
                        color="primary"
                        name="email"
                        size="md"
                        placeholder="you@example.com"
                        rounded="none"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <TextInput
                        label="Password"
                        type="password"
                        labelBgColor="bg-main-200"
                        color="primary"
                        size="md"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                        rounded="none"
                    />

                    <div className="flex justify-between items-center mb-2">
                        <label className="flex items-center space-x-2 text-sm">
                            <input
                                type="checkbox"
                                className="form-checkbox text-primary"
                            />
                            <span className="text-main">Remember me</span>
                        </label>
                        <Link
                            to="/auth/forgot-password"
                            className="text-sm text-primary hover:underline hover:text-accent"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <Button color="primary" size="lg" rounded="full" onClick={handleSubmit}>
                        {loading ? (
                            <>
                                <span
                                    className="animate-spin inline-block border-2 border-t-2 border-main-0 rounded-full w-4 h-4 mr-2"
                                    aria-hidden="true"
                                ></span>
                                <span role="status">Signing you in...</span>
                            </>
                        ) : (
                            "Login"
                        )}
                    </Button>
                </form>

                <div className="mt-4 text-center text-sm text-main-500">
                    Don't have an account?{" "}
                    <Link
                        to="/auth/register"
                        className="text-primary font-semibold hover:underline hover:text-accent"
                    >
                        Create one
                    </Link>

                </div>
                <div className="mt-4 text-center text-sm text-main-500">
                    <Link
                        to="/home"
                        className="text-primary font-semibold hover:underline hover:text-accent"
                    >
                       Go to Home Page
                    </Link>
                </div>
            </div>
        </div>
    );
}
