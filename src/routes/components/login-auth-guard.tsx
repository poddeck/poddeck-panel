import {useCallback, useEffect} from "react";
import {useRouter} from "../hooks";
import {useUserToken} from "@/store/user-store";

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