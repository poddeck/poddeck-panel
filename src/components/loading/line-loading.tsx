import "./line-loading.css";

export function LineLoading() {
  return (
    <div
      className="flex h-full min-h-screen w-full flex-col items-center justify-center">
      <div
        className="relative h-1.5 w-96 overflow-hidden rounded bg-gray-500"
      >
        <div
          className="absolute left-0 top-0 h-full w-1/3 animate-loading bg-black"
        />
      </div>
    </div>
  );
}
