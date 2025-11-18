import {Toaster} from "sonner";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTriangleExclamation} from '@fortawesome/free-solid-svg-icons'

export default function Toast() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 3000,
        classNames: {
          toast: "rounded-lg border-0 backdrop-blur-md text-white!",
          content: "flex-1 ml-4",
          icon: "flex items-center justify-center pl-2!",
          error: "bg-red-400/50! border-red-400!",
        },
      }}
      icons={{
        error: (<FontAwesomeIcon icon={faTriangleExclamation}/>),
      }}
    />
  );
}