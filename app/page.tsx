import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  FileText, 
  Globe, 
  Shield, 
  Users, 
  CheckCircle, 
  Star,
  ArrowRight,
  Sparkles,
  MessageCircle,
  Brain,
  Zap,
  TrendingUp,
  Award,
  Clock
} from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const features = [
    {
      icon: FileText,
      title: "Text & Document Translation",
      description: "Translate text, PDFs, DOCX, PowerPoint, and SRT files with precision and context awareness.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Globe,
      title: "AI Powered Translation",
      description: "Powered by AI for superior accuracy and natural language output.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: TrendingUp,
      title: "Real-time Collaboration",
      description: "Collaborate with team members in real-time, share translations, and maintain consistency across projects.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Sparkles,
      title: "Tone Selection",
      description: "Choose from formal, informal, business, or friendly tones to match your communication style.",
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      icon: Shield,
      title: "Glossary & Grammar",
      description: "Custom glossary terms and advanced grammar checking for consistent, professional translations.",
      gradient: "from-red-500 to-rose-500"
    },
    {
      icon: Users,
      title: "Human Review",
      description: "Optional human review by professional translators for critical documents and perfect accuracy.",
      gradient: "from-indigo-500 to-purple-500"
    }
  ]

  const pricingPlans = [
    {
      name: "Starter",
      description: "Perfect for individuals and small projects",
      price: "$7",
      period: "per month",
      credits: "100 credits",
      features: [
        "100 translation credits (~70K characters)",
        "Text and document translation",
        "Basic tone selection",
        "Grammar checking",
        "Email support"
      ],
      popular: false,
      cta: "Start Free Trial",
      gradient: "from-gray-500 to-gray-600"
    },
    {
      name: "Professional",
      description: "Ideal for businesses and frequent users",
      price: "$35",
      period: "per month",
      credits: "500 credits",
      features: [
        "500 translation credits (~350K characters)",
        "All document formats (PDF, DOCX, PPT, SRT)",
        "Advanced tone selection",
        "Custom glossary terms",
        "Grammar checking",
        "Priority support",
        "Human review (limited)"
      ],
      popular: true,
      cta: "Get Started",
      gradient: "from-primary to-accent"
    },
    {
      name: "Enterprise",
      description: "For large organizations with custom needs",
      price: "$140",
      period: "per month",
      credits: "2,000 credits",
      features: [
        "2,000 translation credits (~1.4M characters)",
        "All features included",
        "Unlimited human reviews",
        "Custom API integration",
        "Dedicated account manager",
        "Advanced analytics",
        "SLA guarantee",
        "24/7 phone support"
      ],
      popular: false,
      cta: "Contact Sales",
      gradient: "from-purple-600 to-pink-600"
    }
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Marketing Director",
      company: "TechGlobal Inc.",
      avatar: "SC",
      content: "TransleXable has revolutionized our international marketing campaigns. The tone selection feature ensures our brand voice remains consistent across all languages.",
      rating: 5,
      gradient: "from-pink-500 to-rose-500"
    },
    {
      name: "Miguel Rodriguez",
      role: "Content Manager",
      company: "EduPrime",
      avatar: "MR",
      content: "The document translation feature is incredible. We can translate entire course materials while maintaining formatting - it's a game changer for our global expansion.",
      rating: 5,
      gradient: "from-blue-500 to-indigo-500"
    },
    {
      name: "Dr. Amina Hassan",
      role: "Research Director",
      company: "MedResearch",
      avatar: "AH",
      content: "The human review option gives us confidence when translating critical research papers. The accuracy and attention to detail is outstanding.",
      rating: 5,
      gradient: "from-green-500 to-emerald-500"
    }
  ]

  const useCases = [
    {
      title: "Global Business",
      description: "Expand internationally with professional document translation and consistent brand messaging.",
      icon: TrendingUp,
      stats: "500+ Companies"
    },
    {
      title: "Content Creation",
      description: "Localize blogs, marketing materials, and social media content for different markets.",
      icon: Sparkles,
      stats: "10M+ Words"
    },
    {
      title: "Education",
      description: "Translate course materials, research papers, and educational content for global audiences.",
      icon: Award,
      stats: "200+ Universities"
    },
    {
      title: "Legal & Medical",
      description: "Ensure accuracy in critical documents with human review and specialized terminology.",
      icon: Shield,
      stats: "99.9% Accuracy"
    }
  ]

  const stats = [
    { label: "Active Users", value: "50K+", icon: Users },
    { label: "Documents Translated", value: "2M+", icon: FileText },
    { label: "Languages Supported", value: "100+", icon: Globe },
    { label: "Average Rating", value: "4.9/5", icon: Star }
  ]

  return (
    <div className="flex flex-col overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 ">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(232, 121, 249, 0.1) 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, rgba(115, 209, 179, 0.1) 0%, transparent 50%)`,
          }} />
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(45deg, rgba(232, 121, 249, 0.05) 1px, transparent 1px),
                             linear-gradient(-45deg, rgba(115, 209, 179, 0.05) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }} />
        </div>
        
        {/* Floating orbs with enhanced animations */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-primary/30 to-accent/30 rounded-full blur-3xl animate-float animate-glow" />
        <div className="absolute top-3/4 right-1/4 w-40 h-40 bg-gradient-to-r from-accent/30 to-primary/30 rounded-full blur-3xl animate-float animate-glow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/6 w-24 h-24 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-2xl animate-float animate-glow" style={{ animationDelay: '4s' }} />
        <div className="absolute bottom-1/4 left-3/4 w-36 h-36 bg-gradient-to-r from-accent/25 to-primary/25 rounded-full blur-3xl animate-float animate-glow" style={{ animationDelay: '1s' }} />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 text-center z-10">
          <div className="space-y-8">
            {/* Enhanced badge */}
            <div className="inline-flex items-center space-x-2 modern-card rounded-full px-6 py-3 shadow-glow">
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              <span className="text-sm font-semibold ">
                AI Powered Translation
              </span>
              <Zap className="h-4 w-4 text-accent animate-pulse" />
            </div>
            
            {/* Enhanced main headline */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight">
                Professional Translation{" "}
                <span className="relative">
                  <span className="gradient-text animate-gradient-x">Made Simple</span>
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 blur-xl -z-10 animate-pulse" />
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                Transform your content with AI-powered precision. Translate text and documents 
                with industry-leading accuracy, tone control, and human review options.
              </p>
            </div>
            
            {/* Enhanced CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                size="lg" 
                asChild 
                className="btn-primary-enhanced text-lg px-10 py-4 h-auto rounded-xl shadow-glow-lg hover:shadow-glow-lg transform hover:scale-105 transition-all duration-300"
              >
                <Link href="/translate" className="flex items-center space-x-2">
                  <span>Start Translating</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                asChild 
                className="text-lg px-10 py-4 h-auto rounded-xl border-2 border-primary/30 hover:border-primary hover:bg-primary/5 modern-card hover-lift"
              >
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
            
            {/* Enhanced trust indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
              {[
                { icon: CheckCircle, text: "No setup required" },
                { icon: Zap, text: "Instant translation" },
                { icon: Clock, text: "24/7 availability" }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-center space-x-3 modern-card px-4 py-3 rounded-xl hover-lift">
                  <item.icon className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="text-center modern-card p-6 rounded-2xl hover-lift group">
                  <Icon className="h-8 w-8 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <div className="text-3xl font-bold gradient-text mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 modern-card rounded-full px-4 py-2 mb-6">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Features</span>
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold mb-6">
              Powerful Features for{" "}
              <span className="gradient-text">Professional Translation</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Everything you need to translate content professionally, from simple text to complex documents.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="modern-card hover-lift group overflow-hidden rounded-2xl border-0">
                  <CardHeader className="relative">
                    <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                  </CardContent>
                  <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${feature.gradient} opacity-10 rounded-full blur-xl group-hover:opacity-20 transition-opacity`} />
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-32 bg-gradient-to-br from-card to-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">Perfect for Every Industry</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From global businesses to content creators, TransleXable adapts to your specific needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {useCases.map((useCase, index) => {
              const Icon = useCase.icon
              return (
                <div key={index} className="modern-card p-8 rounded-2xl hover-lift group text-center relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-bold text-xl mb-3">{useCase.title}</h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">{useCase.description}</p>
                    <div className="text-sm font-semibold text-primary">{useCase.stats}</div>
                  </div>
                  <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-xl group-hover:scale-150 transition-transform" />
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 modern-card rounded-full px-4 py-2 mb-6">
              <Award className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Pricing</span>
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold mb-6">
              Simple, Transparent{" "}
              <span className="gradient-text">Pricing</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Pay only for what you use with our credit-based system. 1 credit = 700 characters.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card 
                key={index} 
                className={`modern-card hover-lift relative rounded-3xl border-0 ${
                  plan.popular 
                    ? 'scale-105 shadow-glow-lg ring-2 ring-primary/20' 
                    : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                      Most Popular
                    </div>
                  </div>
                )}
                
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${plan.gradient} opacity-10 rounded-full blur-2xl`} />
                
                <CardHeader className="text-center relative z-10 pb-8">
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <CardDescription className="text-base">{plan.description}</CardDescription>
                  <div className="mt-6">
                    <span className="text-5xl font-bold gradient-text">{plan.price}</span>
                    <span className="text-muted-foreground text-lg">/{plan.period}</span>
                  </div>
                  <div className={`inline-flex items-center bg-gradient-to-r ${plan.gradient} text-white rounded-full px-4 py-2 mt-4 text-sm font-medium`}>
                    {plan.credits}
                  </div>
                </CardHeader>
                
                <CardContent className="relative z-10">
                  <ul className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                        <span className="text-sm leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                
                <CardFooter className="relative z-10 pt-8">
                  <Button 
                    className={`w-full rounded-xl py-3 font-semibold transition-all duration-300 ${
                      plan.popular 
                        ? 'btn-primary-enhanced shadow-glow' 
                        : 'border-2 border-primary/30 hover:border-primary hover:bg-primary/5 hover-lift'
                    }`}
                    variant={plan.popular ? "default" : "outline"}
                    asChild
                  >
                    <Link href="/register">{plan.cta}</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <p className="text-muted-foreground mb-6 text-lg">
              Need custom pricing for your organization?
            </p>
            <Button variant="outline" size="lg" asChild className="modern-card border-primary/30 hover:border-primary hover:bg-primary/5 px-8 py-3 rounded-xl hover-lift">
              <Link href="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {/* <section className="py-32 bg-gradient-to-br from-muted/20 to-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">What Our Customers Say</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join thousands of satisfied customers who trust TransleXable for their translation needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="modern-card hover-lift rounded-2xl border-0 overflow-hidden group">
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${testimonial.gradient} opacity-10 rounded-full blur-xl group-hover:scale-150 transition-transform`} />
                
                <CardHeader className="relative z-10">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${testimonial.gradient} rounded-full flex items-center justify-center shadow-lg`}>
                      <span className="font-bold text-white text-lg">{testimonial.avatar}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      <p className="text-sm text-muted-foreground font-medium">{testimonial.company}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-muted-foreground italic leading-relaxed text-lg">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section> */}

      {/* Enhanced CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary animate-gradient-x" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-transparent" />
        
        {/* Enhanced floating elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-float" />
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-10 left-1/4 w-28 h-28 bg-white/10 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 right-1/3 w-24 h-24 bg-white/10 rounded-full blur-xl animate-float" style={{ animationDelay: '3s' }} />
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="space-y-8">
            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-8">
              Ready to Start Translating?
            </h2>
            <p className="text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Join thousands of professionals who trust TransleXable for accurate, 
              professional translations. Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                size="lg" 
                variant="secondary" 
                asChild 
                className="text-lg px-10 py-4 h-auto bg-white text-primary hover:bg-white/90 shadow-2xl rounded-xl hover-lift font-semibold"
              >
                <Link href="/" className="flex items-center space-x-2">
                  <span>Start Free Trial</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                asChild 
                className="text-lg px-10 py-4 h-auto border-2 border-white/30 text-white hover:bg-white/10 hover:border-white glass rounded-xl hover-lift"
              >
                <Link href="/" className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5" />
                  <span>Book a Demo</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
