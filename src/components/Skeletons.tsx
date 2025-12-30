
export function GameCardSkeleton() {
    return (
        <div className="relative block overflow-hidden rounded-xl bg-gray-900 shadow-md">
            {/* Image Placeholder */}
            <div className="aspect-[4/5] w-full animate-pulse bg-gray-800"></div>

            {/* Content Overlay Placeholder */}
            <div className="absolute inset-x-0 bottom-0 p-6">
                <div className="space-y-3">
                    <div className="h-6 w-3/4 animate-pulse rounded bg-gray-700"></div>
                    <div className="h-4 w-1/2 animate-pulse rounded bg-gray-700"></div>
                    <div className="h-4 w-1/4 animate-pulse rounded bg-gray-700"></div>
                </div>
            </div>
        </div>
    )
}

export function GameCardSkeletonGrid({ count = 8 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {Array.from({ length: count }).map((_, i) => (
                <GameCardSkeleton key={i} />
            ))}
        </div>
    )
}

export function ProductDetailSkeleton() {
    return (
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Image */}
                <div className="aspect-[4/3] w-full animate-pulse rounded-2xl bg-gray-800"></div>

                {/* Details */}
                <div className="space-y-6">
                    <div className="h-10 w-3/4 animate-pulse rounded bg-gray-700"></div>
                    <div className="h-6 w-1/4 animate-pulse rounded bg-gray-700"></div>
                    <div className="space-y-2 pt-4">
                        <div className="h-4 w-full animate-pulse rounded bg-gray-800"></div>
                        <div className="h-4 w-full animate-pulse rounded bg-gray-800"></div>
                        <div className="h-4 w-2/3 animate-pulse rounded bg-gray-800"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
