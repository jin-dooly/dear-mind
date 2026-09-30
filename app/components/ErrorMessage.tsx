export function ErrorMessage({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  if (!children) return null;
  return (
    <p role="alert" className={`text-[12px] text-folder-pink-text text-center ${className}`}>
      {children}
    </p>
  );
}
