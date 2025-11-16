import ErrorLayout from "./components/ErrorLayout";

export default function Page500() {
  return (
    <ErrorLayout
      title="Internal Server Error!"
      description="Sorry for the inconvenience."
    />
  );
}