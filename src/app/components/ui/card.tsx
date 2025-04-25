
import React from "react";


interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}
export function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(" ");
  }  

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-gray-300 rounded-xl border border-gray-100 shadow-sm transition-all bg-opacity-90 hover:shadow-lg hover:bg-opacity-100 duration-300",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className, ...props }: CardContentProps) {
  return (
    <div className={cn("p-4", className)} {...props}>
      {children}
    </div>
  );
}
