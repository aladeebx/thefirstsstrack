import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
    'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 duration-200',
    {
        variants: {
            variant: {
                default: 'bg-primary-red text-white hover:bg-red-700 shadow-lg shadow-red-500/20',
                secondary: 'bg-gray-100 text-soft-black hover:bg-gray-200',
                outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground border-gray-200 hover:border-gray-300 text-soft-black',
                ghost: 'hover:bg-gray-100 hover:text-accent-foreground text-soft-black',
                link: 'text-primary-red underline-offset-4 hover:underline',
            },
            size: {
                default: 'h-11 px-5 py-2.5',
                sm: 'h-9 px-3',
                lg: 'h-12 px-8 text-base',
                icon: 'h-10 w-10',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);

export interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> { }

const Button = forwardRef<HTMLButtonElement, ButtonProps & { loading?: boolean }>(
    ({ className, variant, size, loading, children, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size, className }))}
                disabled={loading || props.disabled}
                ref={ref}
                {...props}
            >
                {loading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading...
                    </>
                ) : (
                    children
                )}
            </button>
        );
    }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
