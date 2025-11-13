import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';
import { Wallet } from "lucide-react";

// Simple utility function to merge classes
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

// Inline badge implementation to avoid import issues
const Badge = ({ 
  className, 
  variant = "default", 
  children 
}: { 
  className?: string; 
  variant?: "default" | "secondary" | "destructive" | "outline"; 
  children: React.ReactNode; 
}) => {
  const baseClasses = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
  
  const variantClasses = {
    default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
    outline: "text-foreground",
  };
  
  return (
    <span className={cn(baseClasses, variantClasses[variant], className)}>
      {children}
    </span>
  );
};

// Inline button implementation to avoid import issues
const Button = ({ 
  children, 
  className, 
  variant = "default", 
  size = "default", 
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { 
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"; 
  size?: "default" | "sm" | "lg" | "icon";
}) => {
  const baseClasses = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  };
  
  const sizeClasses = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  };
  
  return (
    <button 
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};

// Build trigger: 2025-11-12 12:55:05
export const WalletConnect = () => {
  const currentAccount = useCurrentAccount();

  return (
    <div>
      {currentAccount ? (
        <div className="flex items-center gap-2">
          <div className="glass-card px-4 py-2 rounded-lg">
            <p className="text-sm neon-text font-mono">
              {currentAccount.address.substring(0, 6)}...{currentAccount.address.substring(currentAccount.address.length - 4)}
            </p>
          </div>
          <Badge variant="secondary" className="text-xs">
            {currentAccount.label || 'Wallet'}
          </Badge>
        </div>
      ) : (
        <ConnectButton connectText="Connect Wallet">
          <Button
            className="neon-border glow-hover group relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              Connect Wallet
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Button>
        </ConnectButton>
      )}
    </div>
  );
};