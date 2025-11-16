import ErrorLayout from "./components/ErrorLayout";

export default function Page403() {
  return (
    <ErrorLayout
      title="Access Denied"
      description="You do not have permission to access this resource."
    />
  );
}