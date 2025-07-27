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
import { useTranslations } from 'next-intl'

export default function AboutPage() {
  const t = useTranslations('about')

  const stats = [
    { number: "50+", label: t('stats.languages'), icon: Globe },
    { number: "10K+", label: t('stats.users'), icon: Users },
    { number: "1M+", label: t('stats.documents'), icon: Brain },
    { number: "99.9%", label: t('stats.accuracy'), icon: Target }
  ]

  const values = [
    {
      icon: Sparkles,
      title: t('values.innovation.title'),
      description: t('values.innovation.description'),
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Users,
      title: t('values.userCentric.title'),
      description: t('values.userCentric.description'),
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Shield,
      title: t('values.privacy.title'),
      description: t('values.privacy.description'),
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Heart,
      title: t('values.connection.title'),
      description: t('values.connection.description'),
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
            <span className="text-sm font-medium text-primary">{t('hero.badge')}</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-6">
            {t('hero.title')}
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
            {t('hero.description')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="btn-primary-enhanced text-lg px-8 py-6 h-auto rounded-xl shadow-glow hover:shadow-glow-lg transform hover:scale-105 transition-all duration-300">
              <Link href="/register" className="flex items-center space-x-2">
                <span>{t('hero.getStarted')}</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" asChild className="text-lg px-8 py-6 h-auto rounded-xl border-primary/20 hover:bg-primary/10 hover:border-primary/40 transition-all duration-300">
              <Link href="/#features">{t('hero.learnMore')}</Link>
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
              <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('mission.title')}</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                {t('mission.paragraph1')}
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                {t('mission.paragraph2')}
              </p>
              <div className="flex items-center space-x-2 text-primary">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">{t('mission.trusted')}</span>
              </div>
            </div>
            <div className="relative">
              <Card className="modern-card border-border/20 shadow-2xl">
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Globe className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-4">{t('mission.impact.title')}</h3>
                    <p className="text-muted-foreground">
                      {t('mission.impact.description')}
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('values.title')}</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t('values.description')}
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
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('cta.title')}</h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            {t('cta.description')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="btn-primary-enhanced text-lg px-8 py-6 h-auto rounded-xl shadow-glow hover:shadow-glow-lg transform hover:scale-105 transition-all duration-300">
              <Link href="/register" className="flex items-center space-x-2">
                <span>{t('cta.getStarted')}</span>
                <Zap className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" asChild className="text-lg px-8 py-6 h-auto rounded-xl border-primary/20 hover:bg-primary/10 hover:border-primary/40 transition-all duration-300">
              <Link href="/pricing">{t('cta.viewPricing')}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
} 