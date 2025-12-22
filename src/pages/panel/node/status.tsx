export default function NodeHeaderStatus({isActive}: { isActive: boolean }) {
  if (!isActive) {
    return (
      <span className="relative flex size-3">
        <span
          className="relative inline-flex size-3 rounded-full bg-zinc-500"></span>
      </span>
    )
  }
  return (
    <span className="relative flex size-3">
      <span
        className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
      <span
        className="relative inline-flex size-3 rounded-full bg-emerald-500"></span>
    </span>
  )
}