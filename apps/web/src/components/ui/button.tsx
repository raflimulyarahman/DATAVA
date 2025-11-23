import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
}

export const buttonVariants = (options?: { variant?: string; size?: string }) => {
  const variant = options?.variant || 'default';
  const size = options?.size || 'default';
  
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
  
  const variantClasses: Record<string, string> = {
    default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
    outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90"
  };
  
  const sizeClasses: Record<string, string> = {
    sm: "h-8 rounded-md px-3 text-xs",
    default: "h-9 px-4 py-2",
    lg: "h-10 rounded-md px-8"
  };
  
  return `${baseClasses} ${variantClasses[variant] || variantClasses.default} ${sizeClasses[size] || sizeClasses.default}`;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const classes = `${buttonVariants({ variant, size })} ${className || ''}`;
    
    return (
      <button
        ref={ref}
        className={classes}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";