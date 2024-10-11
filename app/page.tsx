"use client";
import * as React from "react";
import { useState } from "react"; // Add this import for useState

import { ArrowRight, Scissors, Loader2 } from "lucide-react"; // Import the missing Scissors icon
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Import Label component if not yet imported
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"; // Assuming you have Card components in your UI library
import { FeaturesSection } from "@/components/features-section";
import { CTASection } from "@/components/cta-section";

import { toast } from "react-hot-toast";

export default function HomePage() {
  const [longUrl, setLongUrl] = useState(""); // Ensure state initialization with an empty string
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false); // New loading state

  const shortenUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Set loading to true

    try {
      // Send a POST request to /api/shorten with the longUrl
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Specify JSON format
        },
        body: JSON.stringify({ longUrl }), // Send the long URL in the request body
      });

      if (response.ok) {
        const data = await response.json();

        // Check if the response contains the short URL
        if (data.shortUrl) {
          setShortUrl(data.shortUrl); // Set the shortened URL in the state
        } else {
          toast.error("Failed to retrieve the shortened URL");
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "An error occurred while shortening the URL");
      }
    } catch (error) {
      console.error("Error shortening URL:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false); // Set loading to false after the operation completes
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    toast.success("Successfully Copied"); // Fix typo in toast message (success instead of succes)
  };

  return (
    <div className="flex flex-col max-w-screen-md mx-auto">
      <main className="flex-grow px-4 py-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Shorten Your URL</CardTitle>
            <CardDescription>Enter a long URL to get a short link</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={shortenUrl} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url">Long URL</Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com/very/long/url"
                  value={longUrl}
                  onChange={(e) => setLongUrl(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? ( // Show loading indicator if loading is true
                  <Loader2 className="animate-spin size-5" />
                ) : (
                  <>
                    <Scissors className="mr-2 h-4 w-4" /> Shorten URL
                  </>
                )}
              </Button>
            </form>

            {shortUrl && (
              <div className="mt-4 p-4 bg-muted rounded-md">
                <Label htmlFor="shortUrl">Your shortened URL:</Label>
                <div className="flex mt-2">
                  <Input
                    id="shortUrl"
                    value={shortUrl}
                    readOnly
                    className="rounded-r-none"
                  />
                  <Button
                    onClick={handleCopy}
                    className="rounded-l-none"
                  >
                    Copy
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <FeaturesSection />
        <CTASection />
      </main>
    </div>
  );
}