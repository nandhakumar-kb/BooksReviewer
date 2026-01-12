export default function FormInput({ 
    label, 
    error, 
    required,
    maxLength,
    ...props 
}) {
    return (
        <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                {...props}
                maxLength={maxLength}
                className={`w-full px-4 py-3 border-2 rounded-xl outline-none transition-all ${
                    error
                        ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                        : 'border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-200'
                }`}
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={error ? `${props.id}-error` : undefined}
            />
            {error && (
                <p id={`${props.id}-error`} className="text-sm text-red-600 flex items-center gap-1">
                    <span className="font-bold">!</span> {error}
                </p>
            )}
        </div>
    )
}
