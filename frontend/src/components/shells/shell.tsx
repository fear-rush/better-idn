import { cn } from "@/lib/utils";

interface ShellProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Shell({ children, className, ...props }: ShellProps) {
  return (
    <div className="min-h-screen">
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <div
          className={cn(
            "mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </div>
    </div>
  );
} 