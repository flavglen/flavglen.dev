import { useSession } from "next-auth/react";

export const useIsAdmin = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return null;
  }

  if (!session) {
    return false;
  }

  return (session.user as { role?: string })?.role === 'admin';
}