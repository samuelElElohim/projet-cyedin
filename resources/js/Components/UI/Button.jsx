const variants = {
    primary:
        'bg-gray-800 text-white border-transparent hover:bg-gray-700 focus:bg-gray-700 focus:ring-indigo-500 active:bg-gray-900',
    secondary:
        'bg-white text-gray-700 border-gray-300 shadow-sm hover:bg-gray-50 focus:ring-indigo-500',
    danger:
        'bg-red-600 text-white border-transparent hover:bg-red-500 focus:ring-red-500 active:bg-red-700',
};

export default function Button({
    variant = 'primary',
    type = 'button',
    className = '',
    disabled = false,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            type={type}
            disabled={disabled}
            className={`inline-flex items-center rounded-md border px-4 py-2 text-xs font-semibold uppercase tracking-widest transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-25 ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
}
