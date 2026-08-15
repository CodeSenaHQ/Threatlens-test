/** Proof Engine system: force the site into its intentional inky dark security environment. */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

import AuthPage from "@/pages/AuthPage";
import OAuthCallback from "@/pages/OAuthCallback";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/signup" component={() => <AuthPage initialMode="signup" />} />
      <Route path="/login" component={() => <AuthPage initialMode="signin" />} />
      <Route path="/auth" component={() => <AuthPage initialMode="signup" />} />
      <Route path="/oauth/callback" component={OAuthCallback} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
