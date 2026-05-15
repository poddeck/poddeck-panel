import {useEffect} from "react";
import {useRouter} from "../hooks";
import {useHasUserHydrated, useUserToken} from "@/store/user-store";

type Props = {
  children: React.ReactNode;
};
export default function LoginAuthGuard({children}: Props) {
  const router = useRouter();
  const {authentication_token} = useUserToken();

  const hasHydrated = useHasUserHydrated();

  useEffect(() => {
    if (hasHydrated && !authentication_token) {
      router.replace("/login/");
    }
  }, [hasHydrated, authentication_token, router]);

  if (!hasHydrated) {
    return null;
  }

  return <>{children}</>;
}