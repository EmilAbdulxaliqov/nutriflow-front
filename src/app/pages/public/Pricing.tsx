import { Link } from "react-router";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Check, Leaf, ArrowLeft } from "lucide-react";

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-lighter to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Leaf className="size-8 text-primary" />
            <span className="text-xl font-semibold">NutriFlow</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link to="/register">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-20">
        <Button variant="ghost" asChild className="mb-8">
          <Link to="/">
            <ArrowLeft className="size-4 mr-2" />
            Back to home
          </Link>
        </Button>

        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Simple, transparent pricing</h1>
          <p className="text-lg text-muted-foreground">
            Everything you need for personalized nutrition and daily meal delivery
          </p>
        </div>

        <Card className="max-w-2xl mx-auto border-2 border-primary shadow-lg">
          <CardHeader className="text-center">
            <div className="inline-flex items-center gap-2 bg-primary-light text-primary px-4 py-2 rounded-full mb-4 mx-auto">
              <span className="text-sm font-medium">Most Popular</span>
            </div>
            <CardTitle className="text-3xl">Monthly Premium</CardTitle>
            <CardDescription className="text-base">Complete nutrition & delivery service</CardDescription>
            <div className="mt-6">
              <span className="text-5xl font-bold">$299</span>
              <span className="text-xl text-muted-foreground">/month</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            <div>
              <h3 className="font-semibold mb-4">What's included:</h3>
              <ul className="space-y-3">
                {[
                  "Personalized monthly menu (30 days)",
                  "Initial consultation with certified dietitian",
                  "Custom meal plan based on your health goals",
                  "Daily meal delivery to your address",
                  "Real-time delivery tracking",
                  "Detailed macro & calorie breakdown",
                  "Accommodation for dietary restrictions",
                  "Monthly menu review and adjustments",
                  "24/7 customer support",
                  "Cancel anytime",
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="size-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6 border-t space-y-4">
              <Button className="w-full" size="lg" asChild>
                <Link to="/register">Subscribe now</Link>
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                After registration, you'll submit your health data and a dietitian will prepare your menu within 24-48 hours.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="max-w-2xl mx-auto mt-16">
          <h2 className="text-2xl font-bold mb-8 text-center">How billing works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">1. Submit & Pay</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Complete health data submission and make your first payment to activate your subscription.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">2. Menu Preparation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Your dietitian creates your personalized menu (24-48h). You can review and approve it.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">3. Daily Deliveries</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Enjoy 30 days of fresh meals. Auto-renewal monthly unless you cancel.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="max-w-2xl mx-auto mt-12 bg-muted border-0">
          <CardHeader>
            <CardTitle>Need help choosing?</CardTitle>
            <CardDescription>
              Contact our support team at support@nutriflow.com or check our FAQ section for more information.
            </CardDescription>
          </CardHeader>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Leaf className="size-6" />
              <span className="font-semibold">NutriFlow</span>
            </div>
            <p className="text-sm opacity-80">© 2026 NutriFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
