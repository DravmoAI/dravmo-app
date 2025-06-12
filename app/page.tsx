import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, CheckCircle, Star } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  const plans = [
    {
      id: "free",
      name: "Free",
      price: 0,
      period: "forever",
      description: "Perfect for trying out Dravmo",
      maxProjects: 3,
      maxQueries: 10,
      features: ["Up to 3 projects", "10 feedback queries per month", "Basic analysis topics", "Community support"],
      popular: false,
    },
    {
      id: "pro",
      name: "Pro",
      price: 29,
      period: "month",
      description: "For serious designers and teams",
      maxProjects: 50,
      maxQueries: 500,
      features: [
        "Up to 50 projects",
        "500 feedback queries per month",
        "All analysis topics",
        "Masters Mode access",
        "Priority support",
        "Export to PDF",
        "Figma integration",
      ],
      popular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 99,
      period: "month",
      description: "For large teams and organizations",
      maxProjects: -1, // Unlimited
      maxQueries: -1, // Unlimited
      features: [
        "Unlimited projects",
        "Unlimited feedback queries",
        "All analysis topics",
        "Masters Mode access",
        "Custom design masters",
        "Team collaboration",
        "API access",
        "Dedicated support",
      ],
      popular: false,
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border/40">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <span className="font-bold text-primary-foreground">D</span>
            </div>
            <h1 className="text-xl font-bold">Dravmo</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Log In</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-tertiary to-primary bg-clip-text text-transparent">
              AI-Powered Design Feedback
            </h1>
            <p className="text-xl mb-8 text-muted-foreground">
              Upload your designs and get instant, actionable feedback from AI that understands design principles and
              your personal style.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="gap-2">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline">
                  See Demo
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 bg-secondary/20">
          <div className="container">
            <h2 className="text-3xl font-bold mb-12 text-center">How Dravmo Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <span className="font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Upload Your Design</h3>
                <p className="text-muted-foreground">
                  Upload JPG, PNG files or import directly from Figma to get started.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <span className="font-bold text-primary">2</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Select Analysis Topics</h3>
                <p className="text-muted-foreground">
                  Choose what aspects of your design you want feedback on - from layout to typography.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <span className="font-bold text-primary">3</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Get Actionable Feedback</h3>
                <p className="text-muted-foreground">
                  Receive detailed, personalized feedback to improve your designs.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
            <p className="text-muted-foreground">Select the perfect plan for your design feedback needs</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <Card key={plan.id} className={`relative ${plan.popular ? "border-primary" : ""}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      Most Popular
                    </div>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold">
                    ${plan.price}
                    <span className="text-sm font-normal text-muted-foreground">/{plan.period}</span>
                  </div>
                  <p className="text-muted-foreground">{plan.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Link href="/signup" className="block">
                    <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                      Get Started
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="py-16 container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Features</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xl font-bold">Personalized Design Persona</h3>
                  <p className="text-muted-foreground">
                    Set up your design preferences with our quick-start quiz to get feedback tailored to your style.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xl font-bold">Comprehensive Analysis</h3>
                  <p className="text-muted-foreground">
                    Get feedback on layout, typography, color, accessibility, and more.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xl font-bold">Masters Mode</h3>
                  <p className="text-muted-foreground">
                    Analyze your designs through the lens of legendary designers and their philosophies.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xl font-bold">Figma Integration</h3>
                  <p className="text-muted-foreground">
                    Seamlessly import designs from Figma and apply feedback directly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-br from-secondary to-background">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to improve your designs?</h2>
            <p className="text-xl mb-8 text-muted-foreground max-w-2xl mx-auto">
              Join Dravmo today and start getting AI-powered feedback that will take your designs to the next level.
            </p>
            <Link href="/signup">
              <Button size="lg" className="gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/40 py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <span className="font-bold text-primary-foreground">D</span>
              </div>
              <span className="font-bold">Dravmo</span>
            </div>
            <div className="flex gap-6">
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                Terms
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                Privacy
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                Contact
              </Link>
            </div>
            <div className="text-sm text-muted-foreground">© 2025 Dravmo. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
