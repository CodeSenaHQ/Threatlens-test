import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import React from "react";
import { Toaster } from "sonner";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import AuthPage from "./components/AuthPage";
import CommitAnalysisPage from "./components/CommitAnalysisPage";
import DashboardPage from "./components/DashboardPage";
import LandingPage from "./components/LandingPage";
import NotFound from "./components/NotFound";
import OAuthCallback from "./components/OAuthCallback";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/operations" component={DashboardPage} />
      <Route path="/commit-analysis" component={CommitAnalysisPage} />
      <Route path="/signup">
        {() => <AuthPage initialMode="signup" />}
      </Route>
      <Route path="/signin">
        {() => <AuthPage initialMode="signin" />}
      </Route>
      <Route path="/login">
        {() => <AuthPage initialMode="signin" />}
      </Route>
      <Route path="/api/oauth/callback" component={OAuthCallback} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <AuthProvider>
          <Toaster richColors theme="dark" position="top-right" />
          <Router />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
