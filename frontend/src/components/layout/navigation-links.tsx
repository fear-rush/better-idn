import Link from "next/link";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Forum", href: "/forum" },
  { name: "About", href: "/about" },
] as const;

interface NavigationLinkProps {
  className?: string;
  itemClassName?: string;
}

export const NavigationLinks = ({
  className,
  itemClassName,
}: NavigationLinkProps) => {
  return (
    <div className={className}>
      {navigation.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={cn("transition-colors hover:text-primary", itemClassName)}
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
}
