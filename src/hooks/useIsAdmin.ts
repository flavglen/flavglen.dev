import { useSession } from "next-auth/react";

export const useIsAdmin = () => {
  const { data: session } = useSession();

  if (!session) {
    return false;
  }

  return (session.user as { role?: string })?.role === 'admin';
}