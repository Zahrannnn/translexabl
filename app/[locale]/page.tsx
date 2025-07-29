import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  Globe, 
  Shield, 
  Users, 
  CheckCircle, 
  Star,
  ArrowRight,
  Sparkles,
  Zap,
  TrendingUp,
  Award,
  Clock
} from "lucide-react";
import { Link } from '@/navigation';
import { getDictionary } from './dictionaries';

// Manual translation function
function getTranslation(messages: Record<string, unknown>, path: string): string {
  const result = path.split('.').reduce<unknown>((obj, key) => {
    return obj && typeof obj === 'object' && key in obj ? (obj as Record<string, unknown>)[key] : undefined;
  }, messages);
  return typeof result === 'string' ? result : path;
}

interface HomePageProps {
  params: Promise<{ locale: 'en' | 'fr' | 'ar' }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  
  // Load translations manually
  const messages = await getDictionary(locale);
  
  // Create translation function
  const t = (path: string) => getTranslation(messages, path);

  const features = [
    {
      icon: FileText,
      title: t('home.features.textDocumentTranslation.title'),
      description: t('home.features.textDocumentTranslation.description'),
      gradient: "bg-gradient-to-br from-blue-500 to-cyan-500"
    },
    {
      icon: Globe,
      title: t('home.features.aiPoweredTranslation.title'),
      description: t('home.features.aiPoweredTranslation.description'),
      gradient: "bg-gradient-to-br from-purple-500 to-pink-500"
    },
    {
      icon: TrendingUp,
      title: t('home.features.realtimeCollaboration.title'),
      description: t('home.features.realtimeCollaboration.description'),
      gradient: "bg-gradient-to-br from-green-500 to-emerald-500"
    },
    {
      icon: Sparkles,
      title: t('home.features.toneSelection.title'),
      description: t('home.features.toneSelection.description'),
      gradient: "bg-gradient-to-br from-yellow-500 to-orange-500"
    },
    {
      icon: Shield,
      title: t('home.features.glossaryGrammar.title'),
      description: t('home.features.glossaryGrammar.description'),
      gradient: "bg-gradient-to-br from-red-500 to-rose-500"
    },
    {
      icon: Users,
      title: t('home.features.humanReview.title'),
      description: t('home.features.humanReview.description'),
      gradient: "bg-gradient-to-br from-indigo-500 to-purple-500"
    }
  ]

 
  const useCases = [
    {
      title: t('home.useCases.globalBusiness.title'),
      description: t('home.useCases.globalBusiness.description'),
      icon: TrendingUp,
      stats: t('home.useCases.globalBusiness.stats')
    },
    {
      title: t('home.useCases.contentCreation.title'),
      description: t('home.useCases.contentCreation.description'),
      icon: Sparkles,
      stats: t('home.useCases.contentCreation.stats')
    },
    {
      title: t('home.useCases.education.title'),
      description: t('home.useCases.education.description'),
      icon: Award,
      stats: t('home.useCases.education.stats')
    },
    {
      title: t('home.useCases.legalMedical.title'),
      description: t('home.useCases.legalMedical.description'),
      icon: Shield,
      stats: t('home.useCases.legalMedical.stats')
    }
  ]

  const stats = [
    { label: t('home.stats.activeUsers'), value: "50K+", icon: Users },
    { label: t('home.stats.documentsTranslated'), value: "2M+", icon: FileText },
    { label: t('home.stats.languagesSupported'), value: "100+", icon: Globe },
    { label: t('home.stats.averageRating'), value: "4.9/5", icon: Star }
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
                {t('home.aiPoweredBadge')}
              </span>
              <Zap className="h-4 w-4 text-accent animate-pulse" />
            </div>
            
            {/* Enhanced main headline */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight">
                {t('home.hero.title')}{" "}
                <span className="relative">
                  <span className="gradient-text animate-gradient-x">{t('home.hero.madeSimple')}</span>
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 blur-xl -z-10 animate-pulse" />
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                {t('home.hero.subtitle')}
              </p>
            </div>
            
            {/* Enhanced CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                size="lg" 
                asChild 
                className="btn-primary-enhanced text-lg px-10 py-4 h-auto rounded-xl shadow-glow-lg hover:shadow-glow-lg transform hover:scale-105 transition-all duration-300"
              >
                <Link href="/translate-txt" className="flex items-center space-x-2">
                  <span>{t('home.hero.cta')}</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                asChild 
                className="text-lg px-10 py-4 h-auto rounded-xl border-2 border-primary/30 hover:border-primary hover:bg-primary/5 modern-card hover-lift"
              >
                <Link href="#features">{t('home.buttons.learnMore')}</Link>
              </Button>
            </div>
            
            {/* Enhanced trust indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
              {[
                { icon: CheckCircle, text: t('home.trustIndicators.noSetup') },
                { icon: Zap, text: t('home.trustIndicators.instantTranslation') },
                { icon: Clock, text: t('home.trustIndicators.alwaysAvailable') }
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
              <span className="text-sm font-medium text-primary">{t('home.features.title')}</span>
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold mb-6">
              {t('home.features.sectionTitle')}{" "}
              <span className="gradient-text">{t('home.features.sectionHighlight')}</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t('home.features.sectionDescription')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="modern-card hover-lift group overflow-hidden rounded-2xl border-0">
                  <CardHeader className="relative">
                    <div className={`w-14 h-14 ${feature.gradient} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                  </CardContent>
                  <div className={`absolute top-0 right-0 w-20 h-20 ${feature.gradient} opacity-10 rounded-full blur-xl group-hover:opacity-20 transition-opacity`} />
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
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">{t('home.useCases.sectionTitle')}</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t('home.useCases.sectionDescription')}
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
    </div>
  )
}
