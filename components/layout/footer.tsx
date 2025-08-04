'use client';

import { Sparkles, Github, Twitter, Linkedin, Mail, Globe, Shield, Zap } from "lucide-react"
import { Link } from "@/navigation"
import { useTranslations } from 'next-intl'

export function Footer() {
  const t = useTranslations('footer')
  const tNav = useTranslations('navigation')
  
  const footerSections = [
    {
      title: t('sections.product.title'),
      links: [
        { name: t('sections.product.features'), href: "#features" },
        { name: tNav('pricing'), href: "/pricing" },
        { name: t('sections.product.apiDocs'), href: "/" },
        { name: t('sections.product.integrations'), href: "/" },
        { name: t('sections.product.status'), href: "/" },
      ],
    },
    {
      title: t('sections.company.title'),
      links: [
        { name: tNav('about'), href: "/about" },
        { name: t('sections.company.careers'), href: "/" },
        { name: tNav('blogs'), href: "/blogs" },
        { name: t('sections.company.pressKit'), href: "/" },
        { name: t('sections.company.contact'), href: "/" },
      ],
    },
    {
      title: t('sections.support.title'),
      links: [
        { name: t('sections.support.helpCenter'), href: "/" },
        { name: t('sections.support.community'), href: "/" },
        { name: t('sections.support.tutorials'), href: "/" },
        { name: t('sections.support.faq'), href: "/" },
        { name: t('sections.support.systemStatus'), href: "/" },
      ],
    },
    {
      title: t('sections.legal.title'),
      links: [
        { name: t('sections.legal.privacy'), href: "/privacy-policy" },
        { name: t('sections.legal.terms'), href: "/terms-and-conditions" },
        { name: "Refund Policy", href: "/refund-policy" },
        { name: "Shipping Policy", href: "/shipping-policy" },
        { name: t('sections.legal.security'), href: "/" },
      ],
    },
  ]

  const socialLinks = [
    { name: t('social.twitter'), icon: Twitter, href: "#", color: "hover:text-blue-400" },
    { name: t('social.github'), icon: Github, href: "#", color: "hover:text-gray-400" },
    { name: t('social.linkedin'), icon: Linkedin, href: "#", color: "hover:text-blue-600" },
    { name: t('social.email'), icon: Mail, href: "mailto:hello@translexable.com", color: "hover:text-green-500" },
  ]

  const features = [
    { icon: Globe, text: t('features.languages') },
    { icon: Shield, text: t('features.security') },
    { icon: Zap, text: t('features.speed') },
  ]

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-card to-muted/20 border-t border-border/20">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-gradient-to-r from-accent/10 to-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Brand section */}
            <div className="lg:col-span-4 space-y-6">
              <Link href="/" className="flex items-center space-x-3 group hover-lift">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-glow transition-all duration-300">
                    <Sparkles className="h-7 w-7 text-white" />
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold gradient-text">TransleXable</span>
                  <span className="text-sm text-muted-foreground">{t('brand.tagline')}</span>
                </div>
              </Link>
              
              <p className="text-muted-foreground leading-relaxed max-w-md">
                {t('brand.description')}
              </p>

              {/* Feature highlights */}
              <div className="flex flex-wrap gap-4">
                {features.map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <div key={index} className="flex items-center space-x-2 modern-card px-3 py-2 rounded-lg hover-lift">
                      <Icon className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">{feature.text}</span>
                    </div>
                  )
                })}
              </div>

              {/* Social links */}
              <div className="flex space-x-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon
                  return (
                    <Link
                      key={social.name}
                      href={social.href}
                      className={`p-3 modern-card rounded-xl text-muted-foreground transition-all duration-300 hover-lift ${social.color} group`}
                      aria-label={social.name}
                    >
                      <Icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Links sections */}
            <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
              {footerSections.map((section) => (
                <div key={section.title} className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground relative">
                    {section.title}
                    <div className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full" />
                  </h3>
                  <ul className="space-y-3">
                    {section.links.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-sm text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1 block"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

       

        {/* Bottom section */}
        <div className="py-8 border-t border-border/20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-muted-foreground">
              <span>{t('copyright')}</span>
              
            </div>
            
         
          </div>
        </div>
      </div>
    </footer>
  )
} 