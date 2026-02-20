import { Link } from "react-router";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Check, Leaf, ChefHat, Calendar, Heart, Clock, Shield } from "lucide-react";
import { motion } from "motion/react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-lighter to-white">
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageWithFallback src={'src/assets/imgs/NutriFlow-white3.svg'} alt="NutriFlow Logo" className="size-8" />
            <span className="text-xl font-semibold">NutriFlow</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition">
              How it works
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition">
              Pricing
            </a>
            <a href="#faq" className="text-muted-foreground hover:text-foreground transition">
              FAQ
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild className="transition-transform hover:scale-105 active:scale-95">
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild className="transition-transform hover:scale-105 active:scale-95">
              <Link to="/register">Get started</Link>
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-primary-light text-primary px-4 py-2 rounded-full mb-6"
          >
            <Leaf className="size-4" />
            <span className="text-sm font-medium">Personalized Nutrition + Catering Delivery</span>
          </motion.div>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
          >
            Your personal monthly meal plan, delivered daily
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            Expert dietitians create custom monthly menus based on your health goals. Fresh meals delivered to your door every day.
          </motion.p>
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="lg" asChild className="transition-transform hover:scale-105 active:scale-95">
              <Link to="/register">Start your journey</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="transition-transform hover:scale-105 active:scale-95">
              <Link to="/pricing">View pricing</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Hero Image Section */}
      <section className="container mx-auto px-4 pb-20">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1667499745120-f9bcef8f584e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwbWVhbCUyMHByZXAlMjBjb250YWluZXJzfGVufDF8fHx8MTc3MTQ5NDU2OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Healthy meal prep containers with nutritious meals"
            className="w-full rounded-2xl shadow-2xl h-[400px] object-cover"
          />
        </motion.div>
      </section>

      {/* What is NutriFlow */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What is NutriFlow?</h2>
            <p className="text-lg text-muted-foreground">
              NutriFlow combines professional nutrition planning with convenient meal delivery. 
              Get personalized monthly menus created by certified dietitians and delivered fresh to your door.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: Heart,
                title: "Health-First Approach",
                description: "Every menu is tailored to your unique health profile, dietary restrictions, and nutritional goals."
              },
              {
                icon: ChefHat,
                title: "Expert Dietitians",
                description: "Certified nutrition professionals design your monthly meal plan with precise macro and calorie tracking."
              },
              {
                icon: Calendar,
                title: "Daily Delivery",
                description: "Fresh meals prepared and delivered to your location every day. Track delivery status in real-time."
              }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1">
                    <CardHeader>
                      <Icon className="size-10 text-primary mb-4" />
                      <CardTitle>{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{item.description}</CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features with Images */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-20">
            {/* Feature 1 */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              <div>
                <h3 className="text-3xl font-bold mb-4">Personalized Meal Plans</h3>
                <p className="text-lg text-muted-foreground mb-6">
                  Every meal is crafted specifically for you. Our certified dietitians analyze your health data, dietary restrictions, and nutritional goals to create a custom monthly menu that fits your lifestyle perfectly.
                </p>
                <ul className="space-y-3">
                  {[
                    "Tailored to your health goals",
                    "Accommodates dietary restrictions",
                    "Precise macro & calorie tracking",
                    "Monthly menu updates"
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <Check className="size-5 text-primary flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1621758745802-6c16a087ca32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxudXRyaXRpb3VzJTIwbWVhbCUyMHBsYW5uaW5nfGVufDF8fHx8MTc3MTQ5NDU3MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Nutritious meal planning"
                  className="w-full h-[400px] object-cover"
                />
              </div>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              <div className="rounded-2xl overflow-hidden shadow-xl md:order-1">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1681330266932-391fd00f805f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHNhbGFkJTIwYm93bCUyMG51dHJpdGlvbnxlbnwxfHx8fDE3NzE0OTQ1Njl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Fresh healthy salad bowl"
                  className="w-full h-[400px] object-cover"
                />
              </div>
              <div className="md:order-2">
                <h3 className="text-3xl font-bold mb-4">Fresh, Quality Ingredients</h3>
                <p className="text-lg text-muted-foreground mb-6">
                  We source only the finest, freshest ingredients for your meals. Every dish is prepared daily by professional chefs and delivered to ensure maximum nutrition and flavor.
                </p>
                <ul className="space-y-3">
                  {[
                    "Locally sourced produce",
                    "Premium quality proteins",
                    "No artificial preservatives",
                    "Chef-prepared daily"
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <Check className="size-5 text-primary flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              <div>
                <h3 className="text-3xl font-bold mb-4">Convenient Daily Delivery</h3>
                <p className="text-lg text-muted-foreground mb-6">
                  Skip the grocery store and meal prep hassle. Your meals arrive fresh at your doorstep every day, ready to enjoy. Track delivery status in real-time through your dashboard.
                </p>
                <ul className="space-y-3">
                  {[
                    "Daily door-to-door delivery",
                    "Real-time tracking",
                    "Flexible delivery windows",
                    "Eco-friendly packaging"
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <Check className="size-5 text-primary flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1605291566628-6f0c7f5b9453?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwZm9vZCUyMGRlbGl2ZXJ5fGVufDF8fHx8MTc3MTQwODA2NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Healthy food delivery"
                  className="w-full h-[400px] object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How it works</h2>
            <p className="text-lg text-muted-foreground">
              Get started in 4 simple steps
            </p>
          </motion.div>
          <div className="max-w-4xl mx-auto space-y-8">
            {[
              {
                step: "1",
                title: "Create your account",
                description: "Sign up and verify your email in seconds.",
              },
              {
                step: "2",
                title: "Submit health data",
                description: "Share your health metrics, goals, dietary restrictions, and delivery preferences.",
              },
              {
                step: "3",
                title: "Get your personalized menu",
                description: "A certified dietitian reviews your profile and creates a custom monthly meal plan (24-48h).",
              },
              {
                step: "4",
                title: "Enjoy daily deliveries",
                description: "Fresh meals delivered to your door every day. Track status and manage your subscription easily.",
              },
            ].map((item, index) => (
              <motion.div 
                key={item.step} 
                initial={{ x: -30, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex gap-6 items-start"
              >
                <div className="flex-shrink-0 size-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                  {item.step}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section id="pricing" className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-lg text-muted-foreground">
              One plan, everything included
            </p>
          </motion.div>
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <Card className="max-w-md mx-auto border-2 border-primary transition-all hover:shadow-xl hover:-translate-y-1">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Monthly Premium</CardTitle>
                <CardDescription>Complete nutrition & delivery service</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$299</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {[
                    "Personalized monthly menu",
                    "Certified dietitian consultation",
                    "Daily meal delivery (30 days)",
                    "Real-time delivery tracking",
                    "Macro & calorie tracking",
                    "24/7 customer support",
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="size-5 text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" size="lg" asChild>
                  <Link to="/register">Get started</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Who it's for</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: <Clock className="size-8" />,
                title: "Busy Professionals",
                description: "Save time on meal planning and cooking. Focus on what matters most.",
              },
              {
                icon: <Heart className="size-8" />,
                title: "Health-Conscious Individuals",
                description: "Achieve your fitness and wellness goals with expert-designed meals.",
              },
              {
                icon: <Shield className="size-8" />,
                title: "Special Dietary Needs",
                description: "Accommodate allergies, restrictions, and medical dietary requirements.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="transition-all hover:shadow-lg hover:-translate-y-1">
                  <CardHeader>
                    <div className="text-primary mb-4">{item.icon}</div>
                    <CardTitle>{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{item.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <motion.h2 
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold mb-12 text-center"
            >
              Frequently asked questions
            </motion.h2>
            <div className="space-y-6">
              {[
                {
                  q: "How long does it take to get my menu?",
                  a: "After submitting your health data, a certified dietitian will review your profile and create your personalized menu within 24-48 hours.",
                },
                {
                  q: "Can I customize my meals?",
                  a: "Yes! During the health data submission, you can specify dietary restrictions, allergies, food preferences, and goals. Your dietitian will create a menu that fits your needs.",
                },
                {
                  q: "What if I need to cancel?",
                  a: "You can cancel your subscription anytime from your profile settings. Your subscription will remain active until the end of your billing period.",
                },
                {
                  q: "How does delivery work?",
                  a: "Meals are delivered daily to your specified address. You'll receive real-time tracking updates and estimated delivery times through your dashboard.",
                },
              ].map((faq, index) => (
                <motion.div
                  key={faq.q}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="transition-all hover:shadow-md">
                    <CardHeader>
                      <CardTitle className="text-lg">{faq.q}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{faq.a}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <motion.section 
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="py-20 bg-primary text-primary-foreground"
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to transform your nutrition?</h2>
          <p className="text-lg mb-8 opacity-90">Join hundreds of satisfied customers on their health journey</p>
          <Button size="lg" variant="secondary" asChild className="transition-transform hover:scale-105 active:scale-95">
            <Link to="/register">Get started today</Link>
          </Button>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-foreground text-background">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <ImageWithFallback src={'src/assets/imgs/NutriFlow-black3.svg'} alt="NutriFlow Logo" className="size-8" />
              <span className="text-lg font-semibold">NutriFlow</span>
            </div>
            <p className="text-sm opacity-80">© 2026 NutriFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}