import Link, { LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import { forwardRef } from "react";

interface NavLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
  [key: string]: any;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ href, children, className, activeClassName, ...props }, ref) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    const combinedClassName = isActive 
      ? `${className} ${activeClassName}`.trim() 
      : className;

    return (
      <Link
        ref={ref}
        href={href}
        className={combinedClassName}
        {...props}
      >
        {children}
      </Link>
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };