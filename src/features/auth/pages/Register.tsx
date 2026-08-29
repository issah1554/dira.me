import RegisterForm from "../components/RegisterForm";
import { useAuth } from "../../../contexts/AuthContext";
import { Toast } from "../../../components/ui/Toast";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
    const { register, loading, error, user } = useAuth();
    const navigate = useNavigate();

    // Show error toast
    useEffect(() => {
        if (error) {
            Toast.fire({ icon: "error", title: error });
        }
    }, [error]);

    // Show success toast and redirect
    useEffect(() => {
        if (user) {
            Toast.fire({ icon: "success", title: "Registration successful!" });
            navigate("/home");
        }
    }, [user, navigate]);

    return <RegisterForm onRegister={register} loading={loading} />;
}
