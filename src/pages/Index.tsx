import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, Lock } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";

const Index = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      navigate("/profile");
    }
  }, [user, isLoading, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-accent mb-8 shadow-2xl shadow-primary/25">
            <Shield className="w-10 h-10 text-primary-foreground" />
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Secure Authentication
          </h1>

          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Experience enterprise-grade authentication with automatic token
            refresh, secure session management, and seamless user experience.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/auth")}
              className="text-lg px-8 py-6"
            >
              Sign In
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={async () => {
                const BASE_URL =
                  "https://anf-dev-server-903cd9f18f9b.herokuapp.com/api";
                const token = Cookies.get("refreshToken");
                const response = await axios.post(
                  `${BASE_URL}/auth/refresh`,
                  {},
                  {
                    withCredentials: true,
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );
              }}
              className="text-lg px-8 py-6"
            >
              Refresh Token
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-20">
            <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure by Default</h3>
              <p className="text-muted-foreground text-sm">
                JWT tokens with automatic refresh and httpOnly cookies
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
              <p className="text-muted-foreground text-sm">
                Optimized performance with smart token management
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Protected Routes</h3>
              <p className="text-muted-foreground text-sm">
                Automatic route protection with seamless redirects
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
