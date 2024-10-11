import { Zap, Shield, BarChart } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  )
}

export function FeaturesSection() {
  return (
    <section className="w-full py-20 bg-white dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our URL Shortener?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Zap className="h-10 w-10 text-primary" />}
            title="Lightning Fast"
            description="Generate short links instantly and speed up your sharing process."
          />
          <FeatureCard
            icon={<Shield className="h-10 w-10 text-primary" />}
            title="Secure & Reliable"
            description="Your links are protected with enterprise-grade security and 99.9% uptime."
          />
          <FeatureCard
            icon={<BarChart className="h-10 w-10 text-primary" />}
            title="Detailed Analytics"
            description="Track clicks, geographic data, and more with our comprehensive analytics."
          />
        </div>
      </div>
    </section>
  )
}