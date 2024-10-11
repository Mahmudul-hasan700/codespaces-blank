"use client";

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Github, Mail, Twitter } from "lucide-react"
import { toast } from "react-hot-toast"

export default function SignupPage() {
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        // Here you would typically handle the form submission
        // For this example, we'll just show a success message
        toast.success("Signup successful!")
    }

    const handleSocialSignup = (provider: string) => {
        // Here you would typically handle the social signup
        // For this example, we'll just show an alert
        toast.success(`Signing up with ${provider}`)
    }

    return (
        <div className="max-w-screen-md mx-auto p-5 flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
                    <CardDescription>
                        Choose your preferred signup method
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <div className="flex flex-col gap-4">
                        <Button variant="outline" onClick={() => handleSocialSignup('Google')}>
                            <Mail className="w-4 h-4 mr-2" />
                            Google
                        </Button>
                        <Button variant="outline" onClick={() => handleSocialSignup('GitHub')}>
                            <Github className="w-4 h-4 mr-2" />
                            GitHub
                        </Button>
                        <Button variant="outline" onClick={() => handleSocialSignup('Twitter')}>
                            <Twitter className="w-4 h-4 mr-2" />
                            Twitter
                        </Button>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-2">
                            <div className="grid gap-1">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    placeholder="John Doe"
                                    type="text"
                                    autoCapitalize="none"
                                    autoCorrect="off"
                                    required
                                />
                            </div>
                            <div className="grid gap-1">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    placeholder="m@example.com"
                                    type="email"
                                    autoCapitalize="none"
                                    autoComplete="email"
                                    autoCorrect="off"
                                    required
                                />
                            </div>
                            <div className="grid gap-1">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    autoCapitalize="none"
                                    autoCorrect="off"
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full">
                                Sign Up
                            </Button>
                        </div>
                    </form>
                </CardContent>
                <CardFooter>
                    <p className="text-xs text-center text-gray-700">
                        By clicking continue, you agree to our{" "}
                        <a href="#" className="underline hover:text-blue-600">
                            Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#" className="underline hover:text-blue-600">
                            Privacy Policy
                        </a>
                        .
                    </p>
                </CardFooter>
            </Card>
            {error && (
                <Alert variant="destructive" className="mt-4">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
        </div>
    )
}