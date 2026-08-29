import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ResetPasswordForm from "../components/ResetPasswordForm";
import { useAuth } from "../../../contexts/AuthContext";
import { Toast } from "../../../components/ui/Toast";

export default function ResetPasswordPage() {
    const { updatePassword } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleReset = async (password: string) => {
        setLoading(true);
        setError("");
        try {
            await updatePassword(password);
            Toast.fire({ icon: "success", title: "Password updated successfully!" });
            navigate("/home");
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Failed to update password. Please try again.";
            setError(msg);
            Toast.fire({ icon: "error", title: msg });
        } finally {
            setLoading(false);
        }
    };

    return <ResetPasswordForm loading={loading} error={error} onReset={handleReset} />;
}