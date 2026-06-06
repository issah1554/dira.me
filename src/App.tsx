import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AuthLayout from "./features/auth/components/AuthLayout";
import LoginPage from "./features/auth/pages/Login";
import RegisterPage from "./features/auth/pages/Register";
import ForgotPasswordPage from "./features/auth/pages/ForgotPassword";
import ResetPasswordPage from "./features/auth/pages/ResetPassword";
import StatusPage from "./pages/StatusPage";
import { AppLayout } from "./components/layout/AppLayout";
import { Dashboard } from "./features/home/pages/Dashboard";
import { ThemeProvider } from "./contexts/ThemeContext";
import Ledger from "./features/finance/pages/LedgerPage";
import ObligationsPage from "./features/finance/pages/ObligationsPage";
import Budgets from "./features/finance/pages/BudgetPage";
import Accounts from "./features/finance/pages/Accounts";
import { Reports } from "./features/reports/pages/Reports";
import { Settings } from "./features/me/Settings";
import { Help } from "./features/help/pages/Help";
import { Notifications } from "./features/notifications/Notifications";
import { TodoList } from "./features/todo/pages/TodoList";
import { TodoCategories } from "./features/todo/pages/TodoCategories";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import { AccountsGridPage } from "./features/finance/pages/AccountsPage2";

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthProvider>

        <ThemeProvider>
          <Routes>
            {/* public */}
            <Route path="/" element={<LandingPage />} />

            {/* auth */}
            <Route path="/auth" element={<AuthLayout />}>
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="forgot-password" element={<ForgotPasswordPage />} />
              <Route path="reset-password" element={<ResetPasswordPage />} />
            </Route>

            {/* app layout */}
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path="/home" element={<Dashboard />} />

              {/* Todo Management */}
              <Route path="/todos" element={<TodoList />} />
              <Route path="/todos/categories" element={<TodoCategories />} />

              {/* Finance Management */}
              <Route path="/finance/ledger" element={<Ledger />} />
              <Route path="/finance/obligations" element={<ObligationsPage />} />
              <Route path="/finance/budgets" element={<Budgets />} />
              <Route path="/finance/accounts" element={<Accounts />} />
              <Route path="/finance/accounts2" element={<AccountsGridPage />} />


              {/* Reports & Analytics */}
              <Route path="/reports" element={<Reports />} />

              {/* Settings & Help */}
              <Route path="/settings" element={<Settings />} />
              <Route path="/help" element={<Help />} />
              <Route path="/notifications" element={<Notifications />} />
            </Route>

            {/* fallback */}
            <Route path="*" element={<StatusPage status="not-found" />} />
          </Routes>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
