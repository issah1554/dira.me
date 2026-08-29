import { useState } from "react";
import ForgotPasswordForm from "../components/ForgotPasswordForm";
import { useAuth } from "../../../contexts/AuthContext";
import { Toast } from "../../../components/ui/Toast";

export default function ForgotPasswordPage() {
    const { resetPassword } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmitEmail = async (email: string) => {
        setLoading(true);
        setError("");
        try {
            await resetPassword(email);
            Toast.fire({
                icon: "success",
                title: "Password reset link sent to your email!",
            });
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Failed to send reset link. Please try again.";
            setError(msg);
            Toast.fire({ icon: "error", title: msg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <ForgotPasswordForm
            onSubmitEmail={handleSubmitEmail}
            loading={loading}
            error={error}
        />
    );
}