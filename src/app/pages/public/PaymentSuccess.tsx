import { Link, useSearchParams } from "react-router";
import { CheckCircle, Leaf, ArrowRight } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

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
        <Card className="max-w-lg w-full border-2 border-success/30 shadow-lg text-center">
          <CardHeader className="pb-4">
            <div className="flex justify-center mb-4">
              <div className="size-20 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle className="size-10 text-success" />
              </div>
            </div>
            <CardTitle className="text-2xl">Payment Successful!</CardTitle>
            <CardDescription className="text-base mt-2">
              Welcome to NutriFlow Premium. Your subscription has been activated.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-muted rounded-lg p-4 space-y-2 text-left text-sm">
              <p className="font-medium">What happens next:</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>✅ Your account has been upgraded to Premium</li>
                <li>🥗 A dietitian will prepare your personalized menu within 24-48 hours</li>
                <li>📦 Daily meal deliveries will begin once you approve your menu</li>
              </ul>
            </div>

            {sessionId && (
              <p className="text-xs text-muted-foreground font-mono break-all">
                Session ID: {sessionId}
              </p>
            )}

            <Button asChild className="w-full" size="lg">
              <Link to="/user">
                Go to Dashboard
                <ArrowRight className="size-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
