import AuthLayout from "../components/Auth/AuthLayout";
import AuthCard from "../components/Auth/AuthCard";
import LoginForm from "../components/Auth/LoginForm";

export default function Login() {
  return (
    <AuthLayout>
      <AuthCard
        title="Welcome back"
        subtitle="Log in to continue your Fedora Linux journey."
      >
        <LoginForm />
      </AuthCard>
    </AuthLayout>
  );
}
