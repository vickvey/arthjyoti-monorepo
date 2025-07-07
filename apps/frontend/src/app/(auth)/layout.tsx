export default function AuthLayout({
  children,
}: {
  children: React.ReactElement;
}) {
  return <div className="min-h-screen mt-14 lg:mx-64">{children}</div>;
}
