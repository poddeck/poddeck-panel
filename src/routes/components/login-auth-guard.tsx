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
  const {accessToken} = useUserToken();

  const check = useCallback(() => {
    if (!accessToken) {
      router.replace("/login");
    }
  }, [router, accessToken]);

  useEffect(() => {
    check();
  }, [check]);

  return <>{children}</>;
}