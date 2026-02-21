import { Link } from "react-router";
import { XCircle, Leaf, ArrowLeft, RefreshCcw } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";

export default function PaymentCancel() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-lighter to-white flex flex-col">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center gap-2">
          <Leaf className="size-8 text-primary" />
          <span className="text-xl font-semibold">NutriFlow</span>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <Card className="max-w-lg w-full border-2 border-destructive/20 shadow-lg text-center">
          <CardHeader className="pb-4">
            <div className="flex justify-center mb-4">
              <div className="size-20 rounded-full bg-destructive/10 flex items-center justify-center">
                <XCircle className="size-10 text-destructive" />
              </div>
            </div>
            <CardTitle className="text-2xl">Payment Cancelled</CardTitle>
            <CardDescription className="text-base mt-2">
              Your payment was not completed. No charges have been made.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="bg-muted rounded-lg p-4 text-left text-sm text-muted-foreground">
              <p>
                You can try again at any time. If you experienced an issue with payment, 
                please reach out to our support team at{" "}
                <a href="mailto:support@nutriflow.com" className="text-primary underline">
                  support@nutriflow.com
                </a>.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild variant="outline" className="flex-1">
                <Link to="/pricing">
                  <ArrowLeft className="size-4 mr-2" />
                  Back to Pricing
                </Link>
              </Button>
              <Button asChild className="flex-1">
                <Link to="/user/profile">
                  <RefreshCcw className="size-4 mr-2" />
                  Try Again
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
