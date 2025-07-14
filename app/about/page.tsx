/* eslint-disable react/no-unescaped-entities */
'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Globe, 
  Users, 
  Brain, 
  Sparkles, 
  Target, 

  Heart,
  ArrowRight,
  CheckCircle,
  Zap,
  Shield,

} from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  const stats = [
    { number: "50+", label: "Languages Supported", icon: Globe },
    { number: "10K+", label: "Happy Users", icon: Users },
    { number: "1M+", label: "Documents Translated", icon: Brain },
    { number: "99.9%", label: "Accuracy Rate", icon: Target }
  ]

  const values = [
    {
      icon: Sparkles,
      title: "Innovation First",
      description: "We constantly push the boundaries of AI translation technology to deliver cutting-edge solutions.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Users,
      title: "User-Centric",
      description: "Every feature is designed with our users in mind, ensuring intuitive and powerful experiences.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Shield,
      title: "Privacy & Security",
      description: "Your data security and privacy are paramount. We employ enterprise-grade security measures.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Heart,
      title: "Global Connection",
      description: "Breaking down language barriers to connect people and cultures across the globe.",
      gradient: "from-red-500 to-rose-500"
    }
  ]



  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">About TransleXable</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-6">
            Breaking Down Language Barriers
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
            We're on a mission to make global communication seamless through AI-powered translation technology. 
            Our platform empowers individuals and businesses to connect across languages with unprecedented accuracy and ease.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="btn-primary-enhanced text-lg px-8 py-6 h-auto rounded-xl shadow-glow hover:shadow-glow-lg transform hover:scale-105 transition-all duration-300">
              <Link href="/register" className="flex items-center space-x-2">
                <span>Get Started</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" asChild className="text-lg px-8 py-6 h-auto rounded-xl border-primary/20 hover:bg-primary/10 hover:border-primary/40 transition-all duration-300">
              <Link href="/#features">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="modern-card text-center border-border/20 hover:shadow-glow transition-all duration-300 hover-lift">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold gradient-text mb-2">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                At TransleXable, we believe that language should never be a barrier to human connection, 
                business growth, or knowledge sharing. Our cutting-edge AI translation technology is designed 
                to preserve the nuance, context, and emotion of human communication.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                We're not just translating words – we're bridging cultures, enabling global collaboration, 
                and opening doors to new opportunities for millions of people worldwide.
              </p>
              <div className="flex items-center space-x-2 text-primary">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Trusted by 10,000+ users globally</span>
              </div>
            </div>
            <div className="relative">
              <Card className="modern-card border-border/20 shadow-2xl">
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Globe className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-4">Global Impact</h3>
                    <p className="text-muted-foreground">
                      Connecting over 50 languages and empowering seamless communication across continents.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              The principles that guide everything we do and drive us to create the best translation experience possible.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="modern-card border-border/20 hover:shadow-glow transition-all duration-300 hover-lift">
                <CardHeader>
                  <div className={`w-12 h-12 bg-gradient-to-br ${value.gradient} rounded-xl flex items-center justify-center mb-4`}>
                    <value.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      

    

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Experience the Future of Translation?</h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands of users who trust TransleXable for their translation needs. 
            Start breaking down language barriers today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="btn-primary-enhanced text-lg px-8 py-6 h-auto rounded-xl shadow-glow hover:shadow-glow-lg transform hover:scale-105 transition-all duration-300">
              <Link href="/register" className="flex items-center space-x-2">
                <span>Get Started Free</span>
                <Zap className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" asChild className="text-lg px-8 py-6 h-auto rounded-xl border-primary/20 hover:bg-primary/10 hover:border-primary/40 transition-all duration-300">
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
} 