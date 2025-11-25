export default function SidebarClusterStatus({isOnline}: { isOnline: boolean }) {
  if (!isOnline) {
    return (
      <span className="relative flex size-2">
        <span
          className="relative inline-flex size-2 rounded-full bg-rose-500"></span>
      </span>
    )
  }
  return (
    <span className="relative flex size-2">
      <span
        className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
      <span
        className="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
    </span>
  )
}