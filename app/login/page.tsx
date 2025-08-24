"use client";

import Image from "next/image";
import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getSupabaseClient } from "@/lib/supabase";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const router = useRouter();
  const supabase = getSupabaseClient();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        // Check if user has completed persona setup
        try {
          const response = await fetch(`/api/profile/${user.id}`);
          if (response.ok) {
            const data = await response.json();
            if (data.profile?.persona) {
              router.push("/dashboard");
            } else {
              router.push("/persona");
            }
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
          router.push("/dashboard"); // Default to dashboard if we can't check persona status
        }
      }
    };
    checkUser();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data.user) {
        // Check if user has completed persona setup
        try {
          const response = await fetch(`/api/profile/${data.user.id}`);
          if (response.ok) {
            const profileData = await response.json();
            if (profileData.profile?.persona) {
              router.push("/dashboard");
            } else {
              router.push("/persona");
            }
          } else {
            router.push("/persona"); // Default to persona if we can't find profile
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
          router.push("/dashboard"); // Default to dashboard if we can't check persona status
        }
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginWithGoogle = async () => {
    setIsLoading(true);
    console.log("Initiating Google OAuth login...", window.location.origin);

    const { error, data } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (data.url) {
      console.log("Google OAuth initiated successfully:", data);
      window.location.href = data.url;
      return;
    }

    if (error) setError(error.message);

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F1619] px-4 py-8 relative">
      {/* Background overlay image */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-full h-full bg-[url('/landing-page/dotted-line-2.png')] bg-no-repeat bg-center bg-contain"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center">
              <Link href="/" className="flex justify-center items-center gap-2">
                <Image
                  width={128}
                  height={128}
                  src="/logo.svg"
                  alt="Dravmo Logo"
                  className="rounded-full flex items-center justify-center object-contain object-center"
                />
              </Link>
            </div>

            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>Sign in to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
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

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <div>
              <h5 className="text-center mt-2">Or</h5>
              <div className="flex items-center justify-center mt-4">
                <Button variant="outline" className="w-full" onClick={handleLoginWithGoogle}>
                  <FcGoogle className="h-4 w-4 mr-2 inline" />
                  Sign in with Google
                </Button>
              </div>
            </div>

            <div className="mt-4 text-center text-sm">
              Don't have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
