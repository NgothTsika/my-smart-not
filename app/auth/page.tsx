"use client";

import { useSession } from "next-auth/react";
import AuthForm from "@/components/AuthForm";

const AuthPage = () => {
  const { data: session, status } = useSession();

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <AuthForm onClose={() => {}} />
      {status === "authenticated" && (
        <div className="absolute top-4 left-4 text-white">
          <p>Welcome back, {session?.user?.name}!</p>
        </div>
      )}
    </div>
  );
};

export default AuthPage;
