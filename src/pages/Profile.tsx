import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, LogOut, Mail, User, Crown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, isLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out.',
      });
      navigate('/');
    } catch (error) {
      toast({
        title: 'Logout failed',
        description: 'Something went wrong',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 p-4">
      <div className="max-w-4xl mx-auto pt-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Profile</h1>
            <p className="text-muted-foreground">Manage your account information</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow-lg border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Personal Information
              </CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Username</label>
                <p className="text-lg font-semibold text-foreground mt-1">{user.username}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </label>
                <p className="text-lg font-semibold text-foreground mt-1">{user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">User ID</label>
                <p className="text-sm font-mono text-muted-foreground mt-1 bg-muted px-3 py-2 rounded-md">
                  {user.id}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-primary" />
                Subscription Status
              </CardTitle>
              <CardDescription>Your current plan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-6 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg border border-primary/20">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Current Plan</p>
                  {user.premiumSubscription ? (
                    <Badge className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-4 py-1 text-base">
                      Premium Member
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="px-4 py-1 text-base">
                      Free Plan
                    </Badge>
                  )}
                </div>
                {user.premiumSubscription && (
                  <Crown className="h-12 w-12 text-primary opacity-20" />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-lg border-border/50 mt-6">
          <CardHeader>
            <CardTitle>Account Status</CardTitle>
            <CardDescription>Your account is active and secure</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900/50">
              <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
              <p className="text-sm font-medium text-green-900 dark:text-green-100">
                Your session is active and tokens are being automatically refreshed
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
