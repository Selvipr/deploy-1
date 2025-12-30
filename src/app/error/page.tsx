import Link from 'next/link'

export default function ErrorPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center dark:bg-gray-900">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Something went wrong</h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                There was an error processing your request.
            </p>
            <div className="mt-8">
                <Link
                    href="/login"
                    className="rounded-md bg-indigo-600 px-6 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Back to Login
                </Link>
            </div>
        </div>
    )
}
