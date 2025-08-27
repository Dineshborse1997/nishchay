import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Bell, Plus, Edit, Trash2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const NoticeManagement = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    priority: "medium",
    is_active: true
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/admin/notices');
      const data = await response.json();
      
      if (response.ok) {
        setNotices(data);
      }
    } catch (error) {
      console.error('Failed to fetch notices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        toast({
          title: "Error",
          description: "Please login as admin first",
          variant: "destructive"
        });
        return;
      }
      
      const user = JSON.parse(userData);
      console.log('User data:', user);
      
      const url = editingNotice 
        ? `http://localhost:3001/api/admin/notices/${editingNotice.id}`
        : 'http://localhost:3001/api/admin/notices';
      
      const method = editingNotice ? 'PUT' : 'POST';
      const payload = editingNotice 
        ? formData 
        : { ...formData, adminId: user.id };
      
      console.log('Sending payload:', payload);

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const responseData = await response.json();
      console.log('Response:', responseData);

      if (response.ok) {
        toast({
          title: "Success",
          description: `Notice ${editingNotice ? 'updated' : 'created'} successfully`
        });
        fetchNotices();
        resetForm();
      } else {
        throw new Error(responseData.error || 'Failed to save notice');
      }
    } catch (error) {
      console.error('Notice save error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save notice",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (notice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title,
      content: notice.content,
      priority: notice.priority,
      is_active: notice.is_active
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this notice?')) return;
    
    try {
      const response = await fetch(`http://localhost:3001/api/admin/notices/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Notice deleted successfully"
        });
        fetchNotices();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete notice",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({ title: "", content: "", priority: "medium", is_active: true });
    setEditingNotice(null);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Bell className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold">Notice Management</h2>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Notice
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingNotice ? 'Edit Notice' : 'Create Notice'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  rows={4}
                  required
                />
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {editingNotice && (
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                  />
                  <Label>Active</Label>
                </div>
              )}
              <div className="flex space-x-2">
                <Button type="submit" className="flex-1">
                  {editingNotice ? 'Update' : 'Create'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Notices</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading notices...</div>
          ) : notices.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No notices found. Create your first notice!
            </div>
          ) : (
            <div className="space-y-4">
              {notices.map((notice) => (
                <div key={notice.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold">{notice.title}</h3>
                        {notice.priority === 'high' && <AlertCircle className="h-4 w-4 text-red-500" />}
                        <Badge variant={notice.priority === 'high' ? 'destructive' : notice.priority === 'medium' ? 'default' : 'secondary'}>
                          {notice.priority}
                        </Badge>
                        <Badge variant={notice.is_active ? 'default' : 'secondary'}>
                          {notice.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{notice.content}</p>
                      <p className="text-xs text-muted-foreground">
                        Created: {new Date(notice.created_at).toLocaleDateString()} • By: {notice.created_by_name}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(notice)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(notice.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
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

export default NoticeManagement;