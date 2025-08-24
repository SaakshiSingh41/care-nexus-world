import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Ambulance, 
  MapPin, 
  Clock, 
  Phone, 
  AlertTriangle, 
  CheckCircle,
  Navigation,
  Heart
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LocationData {
  lat: number;
  lng: number;
  address: string;
}

interface AmbulanceData {
  id: string;
  driverName: string;
  vehicleNumber: string;
  eta: number;
  currentLat: number;
  currentLng: number;
}

export default function AmbulanceBooking() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [emergencyType, setEmergencyType] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [assignedAmbulance, setAssignedAmbulance] = useState<AmbulanceData | null>(null);
  const [eta, setEta] = useState(0);
  const [requestId, setRequestId] = useState('');

  useEffect(() => {
    // Auto-get location on component mount
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    
    if (!navigator.geolocation) {
      toast({
        title: "Location not supported",
        description: "Your browser doesn't support location services.",
        variant: "destructive",
      });
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        // Mock reverse geocoding
        const mockAddress = `${lat.toFixed(4)}, ${lng.toFixed(4)} - Current Location`;
        
        setLocation({ lat, lng, address: mockAddress });
        setIsLoadingLocation(false);
        
        toast({
          title: "Location found",
          description: "Your current location has been detected.",
        });
      },
      (error) => {
        console.error('Location error:', error);
        toast({
          title: "Location access denied",
          description: "Please enable location services or enter your address manually.",
          variant: "destructive",
        });
        setIsLoadingLocation(false);
      }
    );
  };

  const handleEmergencyRequest = async () => {
    if (!location || !emergencyType) {
      toast({
        title: "Missing information",
        description: "Please share your location and select emergency type.",
        variant: "destructive",
      });
      return;
    }

    setStep(2);
    
    // Simulate ambulance dispatch
    const mockRequestId = `AMB-${Date.now()}`;
    setRequestId(mockRequestId);
    
    // Simulate finding nearest ambulance
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockAmbulance: AmbulanceData = {
      id: 'AMB001',
      driverName: 'Dr. Sarah Johnson',
      vehicleNumber: 'EMT-2024-001',
      eta: Math.floor(Math.random() * 15) + 5, // 5-20 minutes
      currentLat: location.lat + (Math.random() - 0.5) * 0.01,
      currentLng: location.lng + (Math.random() - 0.5) * 0.01
    };
    
    setAssignedAmbulance(mockAmbulance);
    setEta(mockAmbulance.eta);
    setStep(3);
    
    toast({
      title: "Ambulance dispatched",
      description: `Emergency response unit ${mockAmbulance.vehicleNumber} is on the way.`,
    });
  };

  // Simulate real-time ETA updates
  useEffect(() => {
    if (step === 3 && eta > 0) {
      const interval = setInterval(() => {
        setEta(prev => Math.max(0, prev - 1));
      }, 60000); // Update every minute
      
      return () => clearInterval(interval);
    }
  }, [step, eta]);

  const getSeverityColor = (type: string) => {
    switch (type) {
      case 'critical': return 'destructive';
      case 'urgent': return 'outline';
      case 'moderate': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container max-w-4xl mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Ambulance className="h-8 w-8 text-emergency" />
            {t('ambulance.booking_title')}
          </h1>
          <p className="text-muted-foreground">
            Request immediate emergency medical assistance with real-time tracking.
          </p>
        </div>

        {/* Emergency Alert */}
        <Alert className="mb-6 border-emergency">
          <AlertTriangle className="h-4 w-4 text-emergency" />
          <AlertDescription>
            <strong>Life-threatening emergency?</strong> Call your local emergency number immediately: 
            <span className="font-bold"> 911 (US), 999 (UK), 112 (EU)</span>
          </AlertDescription>
        </Alert>

        {step === 1 && (
          <div className="space-y-6">
            {/* Location Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Location Information
                </CardTitle>
                <CardDescription>
                  {t('ambulance.location_sharing')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {location ? (
                  <div className="p-4 rounded-lg bg-success-light border border-success">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-success" />
                      <span className="font-medium">Location confirmed</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{location.address}</p>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      We need your location to dispatch the nearest ambulance
                    </p>
                    <Button 
                      onClick={getCurrentLocation} 
                      disabled={isLoadingLocation}
                      variant="hero"
                    >
                      <Navigation className="mr-2 h-4 w-4" />
                      {isLoadingLocation ? 'Getting location...' : 'Share My Location'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Emergency Type Section */}
            <Card>
              <CardHeader>
                <CardTitle>{t('ambulance.emergency_type')}</CardTitle>
                <CardDescription>
                  Select the severity level to help us prioritize your request
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={emergencyType} onValueChange={setEmergencyType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select emergency severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive" className="w-3 h-3 rounded-full p-0"></Badge>
                        {t('ambulance.severity_critical')}
                      </div>
                    </SelectItem>
                    <SelectItem value="urgent">
                      <div className="flex items-center gap-2">
                        <Badge className="w-3 h-3 rounded-full p-0 bg-warning"></Badge>
                        {t('ambulance.severity_urgent')}
                      </div>
                    </SelectItem>
                    <SelectItem value="moderate">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="w-3 h-3 rounded-full p-0"></Badge>
                        {t('ambulance.severity_moderate')}
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Button 
              onClick={handleEmergencyRequest}
              className="w-full emergency-pulse"
              size="lg"
              variant="emergency"
              disabled={!location || !emergencyType}
            >
              <Ambulance className="mr-2 h-5 w-5" />
              {t('ambulance.request_ambulance')}
            </Button>
          </div>
        )}

        {step === 2 && (
          <Card>
            <CardContent className="text-center py-16">
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-warning/10 flex items-center justify-center">
                  <Ambulance className="h-8 w-8 text-warning animate-pulse" />
                </div>
                <h3 className="text-xl font-semibold">Dispatching Emergency Response</h3>
                <p className="text-muted-foreground">
                  Finding the nearest available ambulance to your location...
                </p>
                <div className="w-full max-w-md mx-auto">
                  <Progress value={65} className="h-2" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Request ID: {requestId}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && assignedAmbulance && (
          <div className="space-y-6">
            <Card className="border-success">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-success">
                  <CheckCircle className="h-5 w-5" />
                  {t('ambulance.ambulance_dispatched')}
                </CardTitle>
                <CardDescription>
                  Emergency response unit is on the way to your location
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* ETA Display */}
                <div className="text-center p-6 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {eta > 0 ? `${eta} min` : 'Arriving now'}
                  </div>
                  <p className="text-sm text-muted-foreground">{t('ambulance.estimated_arrival')}</p>
                </div>

                {/* Ambulance Details */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Vehicle Number</Label>
                    <p className="text-lg font-mono">{assignedAmbulance.vehicleNumber}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Emergency Medical Technician</Label>
                    <p className="text-lg">{assignedAmbulance.driverName}</p>
                  </div>
                </div>

                {/* Emergency Type Badge */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Emergency Type:</span>
                  <Badge variant={getSeverityColor(emergencyType)}>
                    {emergencyType.toUpperCase()}
                  </Badge>
                </div>

                {/* Actions */}
                <div className="grid md:grid-cols-2 gap-4">
                  <Button variant="outline" className="w-full">
                    <Phone className="mr-2 h-4 w-4" />
                    Call Ambulance
                  </Button>
                  <Button variant="secondary" className="w-full">
                    <MapPin className="mr-2 h-4 w-4" />
                    {t('ambulance.track_ambulance')}
                  </Button>
                </div>

                {/* Live Status */}
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                    <span className="text-sm font-medium">Live Status</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Emergency unit {assignedAmbulance.vehicleNumber} is {eta > 5 ? 'en route' : 'arriving shortly'} to your location.
                    {eta === 0 && ' Please prepare for arrival.'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Important Information */}
            <Alert>
              <Heart className="h-4 w-4" />
              <AlertDescription>
                <strong>While you wait:</strong> Stay calm, ensure the area is safe for the ambulance to access, 
                and have identification ready. If the situation worsens, call emergency services directly.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper component for labels
const Label: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
  <span className={`text-sm font-medium ${className}`}>{children}</span>
);