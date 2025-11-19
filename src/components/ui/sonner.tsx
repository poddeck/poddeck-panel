import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  TriangleAlertIcon,
} from "lucide-react"
import {useTheme} from "next-themes"
import {Toaster as Sonner, type ToasterProps} from "sonner"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTriangleExclamation} from "@fortawesome/free-solid-svg-icons";

const Toaster = ({...props}: ToasterProps) => {
  const {theme = "system"} = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-center"
      toastOptions={{
        duration: 3000,
        classNames: {
          toast: "rounded-lg border-0 backdrop-blur-md text-white!",
          content: "flex-1 ml-4",
          icon: "flex items-center justify-center pl-2!",
          success: "bg-emerald-400/50! border-emerald-400!",
          error: "bg-red-400/50! border-red-400!",
        },
      }}
      icons={{
        success: <CircleCheckIcon className="size-4"/>,
        info: <InfoIcon className="size-4"/>,
        warning: <TriangleAlertIcon className="size-4"/>,
        error: <FontAwesomeIcon icon={faTriangleExclamation}/>,
        loading: <Loader2Icon className="size-4 animate-spin"/>,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export {Toaster}
