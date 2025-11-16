import ErrorLayout from "./components/ErrorLayout";

export default function Page404() {
  return (
    <ErrorLayout
      title="Oops! Page not found!"
      description="The page you’re looking for doesn’t exist or has been moved."
    />
  );
}