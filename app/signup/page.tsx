"use client";

import type React from "react";
import Image from "next/image";

import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getSupabaseClient } from "@/lib/supabase";
import { Checkbox } from "@/components/ui/checkbox";
import { initStorageBuckets } from "@/lib/supabase-storage";
import { Eye, EyeOff, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignupPage() {
  const router = useRouter();
  const supabase = getSupabaseClient();
  const [formData, setFormData] = useState({
    email: "",
    lastName: "",
    password: "",
    firstName: "",
    confirmPassword: "",
  });

  const [success, setSuccess] = useState("");
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        router.push("/dashboard");
      }
    };

    checkUser();

    // Initialize storage buckets
    initStorageBuckets();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

  
    //Clear confirmPassword error when both match
    if (
      (name === "password" || name === "confirmPassword") &&
      formData.confirmPassword && 
      (name === "confirmPassword" ? value : formData.confirmPassword) ===
        (name === "password" ? value : formData.password)
    ) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.confirmPassword;
        return newErrors;
      });
    }
  };
  

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!agreeToTerms) {
      newErrors.terms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!validateForm()) {
      return;
    }
  
    setIsEmailLoading(true);
    setErrors({});
    setSuccess("");
  
    try {
      // 1. Create user with Supabase Auth. That's it!
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {

          
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            full_name: `${formData.firstName} ${formData.lastName}`,
          },
        },
      });
  
      if (error) {
        setErrors({ general: error.message });
        return; // Stop here if signup failed
      }
  
      // 2. The database trigger will automatically create the profile.
      //    We just need to show the success message to the user.
      if (data.user) {
          setSuccess(
            "Please check your email and click the confirmation link to complete your registration."
          );
      }
  
    } catch (err) {
      setErrors({ general: "An unexpected error occurred. Please try again." });
    } finally {
      setIsEmailLoading(false);
    }
  };

  const handleLoginWithGoogle = async () => {
    setErrors({});
    setSuccess("");
    setIsGoogleLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) setErrors({ general: error.message });
    setIsGoogleLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Card
          className="bg-transparent bg-gradient-to-b from-[rgba(145,187,242,0.1)] to-[rgba(13,27,42,0.1)] backdrop-blur-lg border-[#97FFEF]/25 shadow-[inset_0_1px_1px_0_rgba(247,237,226,0.05),_0_0_30px_5px_rgba(151,255,239,0.2)]"
        >
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
            <CardTitle className="text-2xl">Create your account</CardTitle>
            <CardDescription>Get started with AI-powered design feedback</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              {errors.general && (
                <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                  <AlertCircle className="h-4 w-4" />
                  {errors.general}
                </div>
              )}

              {success && (
                <div className="flex items-center gap-2 p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
                  <CheckCircle className="h-4 w-4" />
                  {success}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`${
                      errors.firstName ? "border-destructive" : "border-white/10"
                    } bg-black/20 focus:bg-black/30`}
                  />
                  {errors.firstName && (
                    <p className="text-xs text-destructive">{errors.firstName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`${
                      errors.lastName ? "border-destructive" : "border-white/10"
                    } bg-black/20 focus:bg-black/30`}
                  />
                  {errors.lastName && <p className="text-xs text-destructive">{errors.lastName}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`${
                    errors.email ? "border-destructive" : "border-white/10"
                  } bg-black/20 focus:bg-black/30`}
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`${
                      errors.password ? "border-destructive" : "border-white/10"
                    } bg-black/20 focus:bg-black/30`}
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
                {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`${
                      errors.confirmPassword ? "border-destructive" : "border-white/10"
                    } bg-black/20 focus:bg-black/30`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive">{errors.confirmPassword}</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => {
                    setAgreeToTerms(checked === true);
                    if (errors.terms) {
                      setErrors((prev) => ({ ...prev, terms: "" }));
                    }
                  }}
                  className="border-white/20"
                />
                <Label htmlFor="terms" className="text-sm leading-none">
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>
              {errors.terms && <p className="text-xs text-destructive">{errors.terms}</p>}

              <Button
                type="submit"
                className="w-full"
                disabled={isEmailLoading || isGoogleLoading || !agreeToTerms}
              >
                {isEmailLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create account"}
              </Button>
            </form>

            <div>
              <h5 className="text-center mt-2">Or</h5>
              <div className="flex items-center justify-center mt-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleLoginWithGoogle}
                  disabled={isEmailLoading || isGoogleLoading}
                >
                  {isGoogleLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <><FcGoogle className="h-4 w-4 mr-2 inline" /> Sign up with Google</>
                  )}
                </Button>
              </div>
            </div>

            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
