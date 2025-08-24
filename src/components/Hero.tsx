import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Heart, 
  Shield, 
  Ambulance, 
  Globe, 
  FileText, 
  Zap,
  ArrowRight,
  CheckCircle 
} from 'lucide-react';
import heroImage from '@/assets/hero-medical.jpg';
import ambulanceImage from '@/assets/ambulance-hero.jpg';
import aiTriageImage from '@/assets/ai-triage.jpg';

export const Hero: React.FC = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: Zap,
      title: t('features.ai_triage'),
      description: t('features.ai_triage_desc'),
      image: aiTriageImage
    },
    {
      icon: Shield,
      title: t('features.verified_doctors'),
      description: t('features.verified_doctors_desc'),
      image: heroImage
    },
    {
      icon: Ambulance,
      title: t('features.emergency_care'),
      description: t('features.emergency_care_desc'),
      image: ambulanceImage
    },
    {
      icon: Globe,
      title: t('features.multilingual'),
      description: t('features.multilingual_desc'),
      image: null
    },
    {
      icon: FileText,
      title: t('features.secure_records'),
      description: t('features.secure_records_desc'),
      image: null
    },
    {
      icon: Heart,
      title: t('features.instant_reports'),
      description: t('features.instant_reports_desc'),
      image: null
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-hero-gradient overflow-hidden">
        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 fade-in">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  {t('hero.title')}
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl">
                  {t('hero.subtitle')}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/patient/assessment">
                    {t('hero.patientCta')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                
                <Button variant="secondary" size="lg" asChild>
                  <Link to="/doctor/register">
                    {t('hero.doctorCta')}
                  </Link>
                </Button>
                
                <Button variant="emergency" size="lg" asChild>
                  <Link to="/ambulance">
                    {t('hero.emergencyCta')}
                  </Link>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-6 pt-8">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span className="text-sm text-muted-foreground">HIPAA Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span className="text-sm text-muted-foreground">Blockchain Secured</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span className="text-sm text-muted-foreground">24/7 Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span className="text-sm text-muted-foreground">50+ Languages</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={heroImage}
                  alt="Global healthcare professionals"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              
              {/* Floating stats */}
              <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-lg shadow-lg border">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">10K+</div>
                  <div className="text-sm text-muted-foreground">Verified Doctors</div>
                </div>
              </div>
              
              <div className="absolute -top-6 -right-6 bg-card p-4 rounded-lg shadow-lg border">
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">50+</div>
                  <div className="text-sm text-muted-foreground">Countries</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Comprehensive Healthcare Solutions
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From AI-powered diagnostics to emergency response, we provide complete healthcare solutions for the modern world.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  {feature.image && (
                    <div className="mb-4 rounded-lg overflow-hidden">
                      <img 
                        src={feature.image} 
                        alt={feature.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className={`w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 ${!feature.image ? 'mb-6' : ''}`}>
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to Transform Healthcare?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of patients and doctors already using CareNexus for better health outcomes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" asChild>
              <Link to="/patient/assessment">
                Start Your Assessment
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white hover:text-primary" asChild>
              <Link to="/doctor/register">
                Join as Healthcare Provider
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};