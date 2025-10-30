import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Shield, LogOut } from "lucide-react";

const AccountPage = () => {
  const { user, isAdmin, logout } = useAuth();

  if (!user) {
    return (
      <>
        <Navigation />
        <main className="container mx-auto px-4 py-16">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>Please log in to view your account</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">You need to be logged in to access this page.</p>
            </CardContent>
          </Card>
        </main>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <main className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Account Information
            </CardTitle>
            <CardDescription>Your profile and account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 border rounded-lg">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-base">{user.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 border rounded-lg">
                <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Account Type</p>
                  <p className="text-base">{isAdmin ? 'Administrator' : 'Customer'}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button
                onClick={logout}
                variant="outline"
                className="w-full"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
};

export default AccountPage;
