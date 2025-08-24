import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Briefcase, 
  FileText, 
  Upload, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Building,
  Phone
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

interface DoctorData {
  // Personal Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Professional Info
  licenseNumber: string;
  specialization: string;
  hospitalAffiliation: string;
  yearsOfExperience: string;
  
  // Documents
  medicalLicense?: File;
  governmentId?: File;
  hospitalLetter?: File;
}

export default function DoctorRegistration() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState('personal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'approved' | 'rejected' | null>(null);
  
  const [doctorData, setDoctorData] = useState<DoctorData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    licenseNumber: '',
    specialization: '',
    hospitalAffiliation: '',
    yearsOfExperience: ''
  });

  const handleFileUpload = (field: keyof DoctorData, file: File) => {
    setDoctorData(prev => ({ ...prev, [field]: file }));
    toast({
      title: "Document uploaded",
      description: `${field} has been uploaded successfully.`,
    });
  };

  const isPersonalInfoComplete = () => {
    return doctorData.firstName && doctorData.lastName && doctorData.email && doctorData.phone;
  };

  const isProfessionalInfoComplete = () => {
    return doctorData.licenseNumber && doctorData.specialization && 
           doctorData.hospitalAffiliation && doctorData.yearsOfExperience;
  };

  const areDocumentsComplete = () => {
    return doctorData.medicalLicense && doctorData.governmentId && doctorData.hospitalLetter;
  };

  const getProgressPercentage = () => {
    let progress = 0;
    if (isPersonalInfoComplete()) progress += 33;
    if (isProfessionalInfoComplete()) progress += 33;
    if (areDocumentsComplete()) progress += 34;
    return progress;
  };

  const handleSubmit = async () => {
    if (!areDocumentsComplete()) {
      toast({
        title: "Documents required",
        description: "Please upload all required documents before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate submission and verification process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setVerificationStatus('pending');
    setIsSubmitting(false);
    
    toast({
      title: "Registration submitted",
      description: "Your registration has been submitted for verification. You will receive an email notification once reviewed.",
    });
  };

  const specializations = [
    'General Medicine',
    'Cardiology',
    'Dermatology',
    'Emergency Medicine',
    'Endocrinology',
    'Gastroenterology',
    'Neurology',
    'Oncology',
    'Pediatrics',
    'Psychiatry',
    'Radiology',
    'Surgery',
    'Other'
  ];

  if (verificationStatus) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="container max-w-2xl mx-auto py-8">
          <Card>
            <CardContent className="text-center py-16">
              <div className="space-y-6">
                <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
                  verificationStatus === 'pending' ? 'bg-warning/10' :
                  verificationStatus === 'approved' ? 'bg-success/10' :
                  'bg-destructive/10'
                }`}>
                  {verificationStatus === 'pending' && <Clock className="h-8 w-8 text-warning" />}
                  {verificationStatus === 'approved' && <CheckCircle className="h-8 w-8 text-success" />}
                  {verificationStatus === 'rejected' && <AlertTriangle className="h-8 w-8 text-destructive" />}
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    {verificationStatus === 'pending' && t('doctor.verification_pending')}
                    {verificationStatus === 'approved' && t('doctor.verification_approved')}
                    {verificationStatus === 'rejected' && t('doctor.verification_rejected')}
                  </h2>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    {verificationStatus === 'pending' && 
                      'Your registration is being reviewed by our verification team and your hospital. This typically takes 24-48 hours.'}
                    {verificationStatus === 'approved' && 
                      'Congratulations! Your medical credentials have been verified. You can now start accepting patients.'}
                    {verificationStatus === 'rejected' && 
                      'Your registration requires additional documentation. Please check your email for specific feedback.'}
                  </p>
                </div>

                {verificationStatus === 'approved' && (
                  <Button variant="hero" size="lg">
                    Access Doctor Dashboard
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container max-w-4xl mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t('doctor.registration_title')}</h1>
          <p className="text-muted-foreground">
            Join our network of verified healthcare professionals and connect with patients worldwide.
          </p>
        </div>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Registration Progress</span>
            <span className="text-sm text-muted-foreground">{getProgressPercentage()}%</span>
          </div>
          <Progress value={getProgressPercentage()} className="h-2" />
        </div>

        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Personal
              {isPersonalInfoComplete() && <CheckCircle className="h-3 w-3 text-success" />}
            </TabsTrigger>
            <TabsTrigger value="professional" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Professional
              {isProfessionalInfoComplete() && <CheckCircle className="h-3 w-3 text-success" />}
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Documents
              {areDocumentsComplete() && <CheckCircle className="h-3 w-3 text-success" />}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>{t('doctor.personal_info')}</CardTitle>
                <CardDescription>
                  Provide your personal contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={doctorData.firstName}
                      onChange={(e) => setDoctorData(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={doctorData.lastName}
                      onChange={(e) => setDoctorData(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={doctorData.email}
                    onChange={(e) => setDoctorData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email address"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Phone Number with Country Code *</Label>
                  <PhoneInput
                    country={'us'}
                    value={doctorData.phone}
                    onChange={(phone) => setDoctorData(prev => ({ ...prev, phone }))}
                    inputStyle={{
                      width: '100%',
                      height: '40px',
                      borderRadius: '6px',
                      border: '1px solid hsl(var(--border))',
                      backgroundColor: 'hsl(var(--background))',
                      color: 'hsl(var(--foreground))'
                    }}
                    buttonStyle={{
                      borderRadius: '6px 0 0 6px',
                      border: '1px solid hsl(var(--border))',
                      backgroundColor: 'hsl(var(--background))'
                    }}
                  />
                </div>

                <Button 
                  onClick={() => setCurrentTab('professional')} 
                  className="w-full"
                  disabled={!isPersonalInfoComplete()}
                >
                  Continue to Professional Information
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="professional">
            <Card>
              <CardHeader>
                <CardTitle>{t('doctor.professional_info')}</CardTitle>
                <CardDescription>
                  Provide your medical credentials and professional details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">{t('doctor.license_number')} *</Label>
                    <Input
                      id="licenseNumber"
                      value={doctorData.licenseNumber}
                      onChange={(e) => setDoctorData(prev => ({ ...prev, licenseNumber: e.target.value }))}
                      placeholder="Enter your medical license number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialization">{t('doctor.specialization')} *</Label>
                    <Select 
                      value={doctorData.specialization} 
                      onValueChange={(value) => setDoctorData(prev => ({ ...prev, specialization: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your specialization" />
                      </SelectTrigger>
                      <SelectContent>
                        {specializations.map((spec) => (
                          <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hospitalAffiliation">{t('doctor.hospital_affiliation')} *</Label>
                  <Input
                    id="hospitalAffiliation"
                    value={doctorData.hospitalAffiliation}
                    onChange={(e) => setDoctorData(prev => ({ ...prev, hospitalAffiliation: e.target.value }))}
                    placeholder="Enter your hospital or clinic name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="yearsOfExperience">Years of Experience *</Label>
                  <Select 
                    value={doctorData.yearsOfExperience} 
                    onValueChange={(value) => setDoctorData(prev => ({ ...prev, yearsOfExperience: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select years of experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-2">0-2 years</SelectItem>
                      <SelectItem value="3-5">3-5 years</SelectItem>
                      <SelectItem value="6-10">6-10 years</SelectItem>
                      <SelectItem value="11-15">11-15 years</SelectItem>
                      <SelectItem value="16-20">16-20 years</SelectItem>
                      <SelectItem value="20+">20+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={() => setCurrentTab('documents')} 
                  className="w-full"
                  disabled={!isProfessionalInfoComplete()}
                >
                  Continue to Document Upload
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>{t('doctor.documents')}</CardTitle>
                <CardDescription>
                  Upload required documents for verification. All documents must be clear and legible.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <FileText className="h-4 w-4" />
                  <AlertDescription>
                    {t('doctor.documents_required')}
                  </AlertDescription>
                </Alert>

                {/* Medical License Upload */}
                <div className="space-y-2">
                  <Label>{t('doctor.upload_license')} *</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById('medical-license')?.click()}
                      >
                        Upload Medical License
                      </Button>
                      {doctorData.medicalLicense && (
                        <p className="text-sm text-success">✓ {doctorData.medicalLicense.name}</p>
                      )}
                    </div>
                    <input
                      id="medical-license"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload('medicalLicense', e.target.files[0])}
                    />
                  </div>
                </div>

                {/* Government ID Upload */}
                <div className="space-y-2">
                  <Label>{t('doctor.upload_id')} *</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById('government-id')?.click()}
                      >
                        Upload Government ID
                      </Button>
                      {doctorData.governmentId && (
                        <p className="text-sm text-success">✓ {doctorData.governmentId.name}</p>
                      )}
                    </div>
                    <input
                      id="government-id"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload('governmentId', e.target.files[0])}
                    />
                  </div>
                </div>

                {/* Hospital Letter Upload */}
                <div className="space-y-2">
                  <Label>{t('doctor.upload_hospital_letter')} *</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById('hospital-letter')?.click()}
                      >
                        Upload Hospital Letter
                      </Button>
                      {doctorData.hospitalLetter && (
                        <p className="text-sm text-success">✓ {doctorData.hospitalLetter.name}</p>
                      )}
                    </div>
                    <input
                      id="hospital-letter"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload('hospitalLetter', e.target.files[0])}
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleSubmit}
                  className="w-full"
                  size="lg"
                  disabled={!areDocumentsComplete() || isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : t('doctor.submit_registration')}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}