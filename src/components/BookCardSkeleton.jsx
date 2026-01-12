export default function BookCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col h-full animate-pulse">
            <div className="relative aspect-[3/4] bg-gradient-to-br from-gray-200 to-gray-300" />
            
            <div className="p-5 flex-1 flex flex-col">
                <div className="h-6 bg-gray-200 rounded-lg mb-2 w-full" />
                <div className="h-6 bg-gray-200 rounded-lg mb-4 w-2/3" />
                <div className="h-4 bg-gray-200 rounded-lg mb-4 w-1/2" />
                
                <div className="mt-auto space-y-3">
                    <div className="flex gap-2">
                        <div className="h-8 bg-gray-200 rounded-lg w-20" />
                        <div className="h-8 bg-gray-200 rounded-lg w-16" />
                    </div>
                    <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-full" />
                </div>
            </div>
        </div>
    )
}
