import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Mail, 
  Phone, 
  Camera, 
  Lock, 
  Eye, 
  EyeOff,
  Calendar,
  Trophy,
  Clock,
  Target,
  Bell
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const ProfilePage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: "John Doe",
    email: "john.doe@email.com",
    mobile: "+91 9876543210",
    photo: ""
  });
  const { toast } = useToast();

  const recentAttempts = [
    {
      id: 1,
      exam: "Police Bharti",
      section: "Model Questions",
      set: "Set 1",
      score: 75,
      date: "2024-01-15",
      time: "45:30",
      status: "completed"
    },
    {
      id: 2,
      exam: "Talathi Bharti",
      section: "PYQs",
      year: "2023",
      score: 82,
      date: "2024-01-12",
      time: "52:15",
      status: "completed"
    }
  ];

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
    setIsEditing(false);
  };

  const handleChangePassword = () => {
    toast({
      title: "Password Changed",
      description: "Your password has been updated successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Profile</h1>
            <p className="text-muted-foreground">Manage your account settings and preferences</p>
          </div>
          <Button asChild>
            <Link to="/student/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Personal Information</CardTitle>
                <Button
                  variant={isEditing ? "default" : "outline"}
                  onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                >
                  {isEditing ? "Save Changes" : "Edit Profile"}
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Photo */}
                <div className="flex items-center space-x-4">
                  <Avatar className="w-24 h-24">
                    {profileData.photo ? (
                      <img src={profileData.photo} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <AvatarFallback className="text-2xl">
                        <User className="w-12 h-12" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  {isEditing && (
                    <div>
                      <Button variant="outline" size="sm" className="flex items-center space-x-2">
                        <Camera className="w-4 h-4" />
                        <span>Change Photo</span>
                      </Button>
                      <p className="text-xs text-muted-foreground mt-1">Max size: 5MB (WebP, JPG, PNG)</p>
                    </div>
                  )}
                </div>

                {/* Profile Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="fullName"
                        value={profileData.fullName}
                        onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
                        className="pl-10"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                        className="pl-10"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="mobile"
                        value={profileData.mobile}
                        onChange={(e) => setProfileData(prev => ({ ...prev, mobile: e.target.value }))}
                        className="pl-10"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Member Since</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        value="January 2024"
                        className="pl-10"
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="currentPassword"
                      type={showPassword ? "text" : "password"}
                      className="pl-10 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      className="pl-10 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      className="pl-10"
                    />
                  </div>
                </div>

                <Button onClick={handleChangePassword}>Update Password</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Device Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Current Device</p>
                      <p className="text-sm text-muted-foreground">Chrome on Windows • Last active: Now</p>
                    </div>
                    <Badge variant="outline" className="text-success">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Mobile Device</p>
                      <p className="text-sm text-muted-foreground">Safari on iPhone • Last active: 2 hours ago</p>
                    </div>
                    <Button variant="outline" size="sm">Remove</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Quiz Attempts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentAttempts.map((attempt) => (
                    <div key={attempt.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{attempt.exam}</h4>
                          <Badge variant="outline">{attempt.section}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {attempt.set ? `Set: ${attempt.set}` : `Year: ${attempt.year}`}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{attempt.date}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{attempt.time}</span>
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-1">
                          <Trophy className="w-4 h-4 text-primary" />
                          <span className="font-semibold text-primary">{attempt.score}</span>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/results/${attempt.id}`}>View Details</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Language & Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Default Language</p>
                    <p className="text-sm text-muted-foreground">Choose your preferred language for the interface</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="default" size="sm">English</Button>
                    <Button variant="outline" size="sm">मराठी</Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive updates about new exams and results</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Bell className="w-4 h-4 mr-2" />
                    Enabled
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">SMS Notifications</p>
                    <p className="text-sm text-muted-foreground">Get SMS alerts for important updates</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Bell className="w-4 h-4 mr-2" />
                    Disabled
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;