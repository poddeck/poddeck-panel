import * as React from "react";

export default function Spinner({
                                  className
                                }: React.ComponentProps<"div">) {
  return (
    <div className={className}>
      <div
        role="status"
        className="
          inline-block
          h-5 w-5
          rounded-full
          border-3 border-solid border-current border-e-transparent
          animate-spin
          align-[-0.25em]
          text-surface
          motion-reduce:animate-[spin_1.5s_linear_infinite]
          dark:text-white
        "
      >
        <span
          className="
            absolute
            m-px h-px w-px
            overflow-hidden
            whitespace-nowrap
            border-0 p-0
            [clip:rect(0,0,0,0)]
          "
        >
          Loading...
        </span>
      </div>
    </div>
  );
}
