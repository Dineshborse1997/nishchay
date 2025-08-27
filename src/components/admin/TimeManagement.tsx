import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TimeManagement = () => {
  const [timeSettings, setTimeSettings] = useState({
    pyq: 60,
    model_papers: 90,
    district_papers: 75,
    subject_wise: 45
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTimeSettings();
  }, []);

  const fetchTimeSettings = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/admin/time-settings');
      const data = await response.json();
      
      if (response.ok) {
        setTimeSettings(data);
      }
    } catch (error) {
      console.error('Failed to fetch time settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/admin/time-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(timeSettings)
      });
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "Time settings updated successfully"
        });
      } else {
        throw new Error('Failed to update time settings');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update time settings",
        variant: "destructive"
      });
    }
  };

  const sections = [
    { key: 'pyq', label: 'Previous Year Questions', description: 'Time limit for PYQ practice tests' },
    { key: 'model_papers', label: 'Model Papers', description: 'Time limit for model paper tests' },
    { key: 'district_papers', label: 'District Papers', description: 'Time limit for district paper tests' },
    { key: 'subject_wise', label: 'Subject Wise', description: 'Time limit for subject-wise practice' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Clock className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold">Time Management</h2>
        </div>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Practice Section Time Limits</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading time settings...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sections.map((section) => (
                <div key={section.key} className="p-4 border rounded-lg">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-foreground">{section.label}</h3>
                      <p className="text-sm text-muted-foreground">{section.description}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Label htmlFor={section.key}>Time (minutes):</Label>
                      <Input
                        id={section.key}
                        type="number"
                        min="1"
                        max="300"
                        value={timeSettings[section.key]}
                        onChange={(e) => setTimeSettings(prev => ({ 
                          ...prev, 
                          [section.key]: parseInt(e.target.value) || 0 
                        }))}
                        className="w-24"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeManagement;