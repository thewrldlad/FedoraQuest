import AuthLayout from "../components/Auth/AuthLayout";
import AuthCard from "../components/Auth/AuthCard";
import RegisterForm from "../components/Auth/RegisterForm";

export default function Register() {
  return (
    <AuthLayout>
      <AuthCard
        title="Create your account"
        subtitle="Start mastering Fedora Linux today."
      >
        <RegisterForm />
      </AuthCard>
    </AuthLayout>
  );
}
