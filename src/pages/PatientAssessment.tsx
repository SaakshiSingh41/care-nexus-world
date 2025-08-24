import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Camera, FileText, Shield, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AssessmentData {
  symptoms: string;
  severity: string;
  duration: string;
  photo?: File;
}

interface TriageResult {
  severity: 'mild' | 'moderate' | 'severe' | 'emergency';
  recommendation: string;
  nextSteps: string[];
  confidence: number;
}

export default function PatientAssessment() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [assessment, setAssessment] = useState<AssessmentData>({
    symptoms: '',
    severity: '',
    duration: ''
  });
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAssessment(prev => ({ ...prev, photo: file }));
      toast({
        title: "Photo uploaded",
        description: "Your photo has been uploaded successfully.",
      });
    }
  };

  const performTriage = async () => {
    setIsLoading(true);
    
    // Simulate AI triage processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock AI triage logic
    const severityScore = assessment.symptoms.toLowerCase().includes('chest pain') ||
                         assessment.symptoms.toLowerCase().includes('difficulty breathing') ||
                         assessment.symptoms.toLowerCase().includes('severe pain') ? 'emergency' :
                         assessment.symptoms.toLowerCase().includes('moderate') ||
                         assessment.severity === 'high' ? 'moderate' :
                         'mild';

    const mockResult: TriageResult = {
      severity: severityScore as TriageResult['severity'],
      recommendation: severityScore === 'emergency' 
        ? 'Seek immediate emergency care' 
        : severityScore === 'moderate'
        ? 'Schedule appointment with healthcare provider within 24-48 hours'
        : 'Monitor symptoms and consider telehealth consultation',
      nextSteps: severityScore === 'emergency'
        ? ['Call emergency services immediately', 'Go to nearest emergency room', 'Inform emergency contacts']
        : severityScore === 'moderate'
        ? ['Book appointment with doctor', 'Monitor symptoms closely', 'Take prescribed medications if any']
        : ['Rest and monitor symptoms', 'Stay hydrated', 'Consider over-the-counter remedies'],
      confidence: Math.random() * 20 + 80 // 80-100% confidence
    };

    setTriageResult(mockResult);
    setIsLoading(false);
    setStep(3);
  };

  const handleSubmit = async () => {
    if (!assessment.symptoms || !assessment.severity || !assessment.duration) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setStep(2);
    await performTriage();
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'emergency': return 'bg-emergency text-emergency-foreground';
      case 'severe': return 'bg-emergency text-emergency-foreground';
      case 'moderate': return 'bg-warning text-warning-foreground';
      case 'mild': return 'bg-success text-success-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container max-w-4xl mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t('patient.assessment_title')}</h1>
          <p className="text-muted-foreground">
            Our AI-powered system will help assess your symptoms and provide appropriate recommendations.
          </p>
        </div>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Assessment Progress</span>
            <span className="text-sm text-muted-foreground">{step}/3</span>
          </div>
          <Progress value={(step / 3) * 100} className="h-2" />
        </div>

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Symptom Information
              </CardTitle>
              <CardDescription>
                Please provide detailed information about your symptoms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {t('patient.emergency_warning')}
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="symptoms">{t('patient.symptoms_label')}</Label>
                <Textarea
                  id="symptoms"
                  placeholder={t('patient.symptoms_placeholder')}
                  value={assessment.symptoms}
                  onChange={(e) => setAssessment(prev => ({ ...prev, symptoms: e.target.value }))}
                  className="min-h-32"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="severity">{t('patient.severity_label')}</Label>
                  <Select value={assessment.severity} onValueChange={(value) => setAssessment(prev => ({ ...prev, severity: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Mild (1-3/10)</SelectItem>
                      <SelectItem value="moderate">Moderate (4-6/10)</SelectItem>
                      <SelectItem value="high">Severe (7-8/10)</SelectItem>
                      <SelectItem value="extreme">Extreme (9-10/10)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">{t('patient.duration_label')}</Label>
                  <Select value={assessment.duration} onValueChange={(value) => setAssessment(prev => ({ ...prev, duration: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minutes">Less than 1 hour</SelectItem>
                      <SelectItem value="hours">1-24 hours</SelectItem>
                      <SelectItem value="days">1-7 days</SelectItem>
                      <SelectItem value="weeks">1-4 weeks</SelectItem>
                      <SelectItem value="months">More than 1 month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="photo">{t('patient.photo_label')}</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('photo')?.click()}
                    className="flex items-center gap-2"
                  >
                    <Camera className="h-4 w-4" />
                    Upload Photo
                  </Button>
                  {assessment.photo && (
                    <span className="text-sm text-success">✓ Photo uploaded</span>
                  )}
                </div>
              </div>

              <Button onClick={handleSubmit} className="w-full" size="lg">
                {t('patient.submit_assessment')}
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardContent className="text-center py-16">
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-primary animate-pulse" />
                </div>
                <h3 className="text-xl font-semibold">Processing Your Assessment</h3>
                <p className="text-muted-foreground">
                  Our AI system is analyzing your symptoms and medical history...
                </p>
                <div className="w-full max-w-md mx-auto">
                  <Progress value={75} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && triageResult && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  {t('patient.triage_results')}
                </CardTitle>
                <CardDescription>
                  AI Assessment completed with {triageResult.confidence.toFixed(1)}% confidence
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Badge className={getSeverityColor(triageResult.severity)} variant="secondary">
                    {triageResult.severity.toUpperCase()}
                  </Badge>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Assessed just now</span>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-accent/50">
                  <h4 className="font-semibold mb-2">Recommendation</h4>
                  <p>{triageResult.recommendation}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Next Steps</h4>
                  <ul className="space-y-2">
                    {triageResult.nextSteps.map((step, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary font-bold text-sm">{index + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid md:grid-cols-2 gap-4 pt-4">
                  <Button variant="hero" className="w-full">
                    Download Report PDF
                  </Button>
                  {triageResult.severity === 'emergency' ? (
                    <Button variant="emergency" className="w-full">
                      Call Emergency Services
                    </Button>
                  ) : (
                    <Button variant="secondary" className="w-full">
                      Book Doctor Appointment
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>Medical Disclaimer:</strong> This assessment is for informational purposes only and does not replace professional medical advice. Always consult with qualified healthcare providers for medical decisions.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>
    </div>
  );
}