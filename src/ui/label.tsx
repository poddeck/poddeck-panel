import * as React from "react"
import {Label as LabelPrimitive} from "radix-ui"
import {twMerge} from "tailwind-merge";
import {clsx} from "clsx";

function Label({
                 className,
                 ...props
               }: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={twMerge(clsx(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      ))}
      {...props}
    />
  )
}

export {Label}