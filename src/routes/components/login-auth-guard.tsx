import {useCallback, useEffect, useMemo} from "react";
import {useNavigate} from "react-router";
import {useUserToken} from "@/store/user-store";

function useRouter() {
  const navigate = useNavigate();

  return useMemo(
    () => ({
      back: () => navigate(-1),
      forward: () => navigate(1),
      reload: () => window.location.reload(),
      push: (href: string) => navigate(href),
      replace: (href: string) => navigate(href, {replace: true}),
    }),
    [navigate],
  );
}

type Props = {
  children: React.ReactNode;
};
export default function LoginAuthGuard({children}: Props) {
  const router = useRouter();
  const {authentication_token} = useUserToken();

  const check = useCallback(() => {
    if (!authentication_token) {
      router.replace("/login/");
    }
  }, [router, authentication_token]);

  useEffect(() => {
    check();
  }, [check]);

  return <>{children}</>;
}