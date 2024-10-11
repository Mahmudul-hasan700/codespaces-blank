import { Link as LinkIcon } from "lucide-react"

export default function Footer() {
    return (
        <footer className="py-6 bg-gray-100 dark:bg-gray-800">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <div className="flex items-center space-x-2">
                        <LinkIcon className="h-6 w-6" />
                        <span className="font-bold">URLShortener</span>
                    </div>
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                        © 2024 URLShortener. All rights reserved.
                    </p>
                    <nav className="flex gap-4 sm:gap-6">
                        <a className="text-sm hover:underline underline-offset-4" href="#">
                            Terms of Service
                        </a>
                        <a className="text-sm hover:underline underline-offset-4" href="#">
                            Privacy
                        </a>
                    </nav>
                </div>
            </div>
        </footer>
    )
}