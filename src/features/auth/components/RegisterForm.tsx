import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/Buttons";
import { TextInput } from "../../../components/ui/TextInput";
import { Toast } from "../../../components/ui/Toast";
interface RegisterFormProps {
    onRegister: (email: string, password: string) => Promise<unknown> | void;
    loading?: boolean;
    error?: string;
}

export default function RegisterForm({
    onRegister,
    loading = false,
    error,
}: RegisterFormProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {            
            Toast.fire({ icon: "error", title: "Passwords do not match" });
            return;
        }
        await onRegister(email, password);
    };

    return (
        <div className="card animation-zoom-in bg-transparent border-0 p-0 p-md-4">
            <div className="card-body p-0">
                {error && (
                    <div className="alert alert-danger">{error}</div>
                )}

                <form  className="grid gap-3">
                    <TextInput
                        color="primary"
                        labelBgColor="bg-main-200"
                        size="md"
                        label="Email Address"
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        rounded="none"
                        required
                    />

                    <TextInput
                        color="primary"
                        labelBgColor="bg-main-200"
                        size="md"
                        label="Password"
                        type="password"
                        name="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        rounded="none"
                        required
                    />

                    <TextInput
                        size="md"
                        color="primary"
                        labelBgColor="bg-main-200"
                        label="Confirm Password"
                        type="password"
                        name="confirmPassword"
                        placeholder="Repeat your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        rounded="none"
                        required
                    />
                    <div className="flex justify-between items-center mb-2">
                        <label className="flex items-center space-x-2 text-sm">
                            <input
                                type="checkbox"
                                className="form-checkbox text-primary"
                            />
                            <span className="text-main">
                                I agree to the <a href="#" className="text-primary hover:underline hover:text-accent">Terms of Service</a> and <a href="#" className="text-primary hover:underline hover:text-accent">Privacy Policy</a>
                            </span>
                        </label>

                    </div>

                    <Button color="primary" size="lg" rounded="full" onClick={handleSubmit}>
                        {loading ? (
                            <>
                                <span
                                    className="animate-spin inline-block border-2 border-t-2 border-white rounded-full w-4 h-4 mr-2"
                                    aria-hidden="true"
                                ></span>
                                <span role="status">Signing you up...</span>
                            </>
                        ) : (
                            "Register"
                        )}
                    </Button>

                </form>

                <div className="flex justify-center items-end mt-2">
                    <div className="text-center">
                        <span className="text-main">Already have an account? </span>
                        <Link to="/auth/login" className="text-primary fw-semibold hover:text-accent hover:underline">
                            Sign in
                        </Link>
                    </div>

                </div>

            </div>
        </div>
    );
}
