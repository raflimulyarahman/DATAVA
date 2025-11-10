import Link, { LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import { forwardRef } from "react";

interface NavLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement>, LinkProps {
  activeClassName?: string;
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