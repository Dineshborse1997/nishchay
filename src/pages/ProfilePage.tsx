import { useState, useEffect } from "react";
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
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    photo: "",
    memberSince: ""
  });
  const [recentAttempts, setRecentAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) return;
      
      const user = JSON.parse(userData);
      
      // Fetch profile
      const profileRes = await fetch(`http://localhost:3001/api/user/profile/${user.id}`);
      const profileData = await profileRes.json();
      
      if (profileRes.ok) {
        const userProfile = profileData.user;
        setProfileData({
          fullName: userProfile.full_name,
          email: userProfile.email,
          mobile: userProfile.mobile,
          photo: userProfile.photo || "",
          memberSince: new Date(userProfile.created_at).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long' 
          })
        });
      }
      
      // Fetch stats for recent activity
      const statsRes = await fetch(`http://localhost:3001/api/user/stats/${user.id}`);
      const statsData = await statsRes.json();
      
      if (statsRes.ok) {
        setRecentAttempts(statsData.recentActivity || []);
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setLoading(false);
    }
  };



  const handleSaveProfile = async () => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        toast({
          title: "Error",
          description: "User data not found. Please login again.",
          variant: "destructive"
        });
        return;
      }
      
      const user = JSON.parse(userData);
      console.log('Updating profile for user:', user.id, {
        ...profileData,
        photo: profileData.photo ? 'Photo present' : 'No photo'
      });
      
      const response = await fetch(`http://localhost:3001/api/user/profile/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: profileData.fullName,
          email: profileData.email,
          mobile: profileData.mobile,
          photo: profileData.photo || null
        })
      });
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const responseData = await response.json();
      console.log('Update response:', responseData);
      
      if (response.ok) {
        // Update localStorage
        const updatedUser = { ...user, fullName: profileData.fullName };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully.",
        });
        setIsEditing(false);
      } else {
        throw new Error(responseData.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive"
      });
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      setProfileData(prev => ({ ...prev, photo: base64String }));
      setUploading(false);
      
      toast({
        title: "Photo Updated",
        description: "Your profile photo has been updated. Don't forget to save changes.",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive"
      });
      return;
    }

    try {
      const userData = localStorage.getItem('user');
      if (!userData) return;
      
      const user = JSON.parse(userData);
      
      const response = await fetch(`http://localhost:3001/api/user/password/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });
      
      const responseData = await response.json();
      
      if (response.ok) {
        toast({
          title: "Password Changed",
          description: "Your password has been updated successfully.",
        });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        throw new Error(responseData.error || 'Failed to change password');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to change password. Please try again.",
        variant: "destructive"
      });
    }
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
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                        id="photo-upload"
                      />
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center space-x-2"
                        onClick={() => document.getElementById('photo-upload')?.click()}
                        disabled={uploading}
                      >
                        <Camera className="w-4 h-4" />
                        <span>{uploading ? 'Uploading...' : 'Change Photo'}</span>
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
                        value={profileData.memberSince}
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
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
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
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
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
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
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
                {loading ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Loading recent activity...</p>
                  </div>
                ) : recentAttempts.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No quiz attempts yet. Start practicing to see your activity here!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentAttempts.map((attempt) => (
                      <div key={attempt.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">{attempt.exam_title}</h4>
                            <Badge variant="outline">Score: {attempt.percentage}%</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {attempt.score}/{attempt.total_questions} correct
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(attempt.created_at).toLocaleDateString()}</span>
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-2 mb-1">
                            <Trophy className="w-4 h-4 text-primary" />
                            <span className="font-semibold text-primary">{attempt.percentage}%</span>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/results/${attempt.id}`}>View Details</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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