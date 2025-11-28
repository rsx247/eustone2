"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Building2, LogOut, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AccountPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem('admin_logged_in') === 'true';
    setIsLoggedIn(loggedIn);
    setIsLoading(false);
    
    if (!loggedIn) {
      router.push('/login?returnUrl=/account');
      return;
    }

    // Load user data (in a real app, this would come from an API)
    const storedEmail = localStorage.getItem('user_email') || 'user@example.com';
    const storedName = localStorage.getItem('user_name') || 'User';
    setEmail(storedEmail);
    setName(storedName);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
    router.push('/');
  };

  const handleSave = async () => {
    setIsSaving(true);
    // In a real app, this would save to an API
    localStorage.setItem('user_name', name);
    localStorage.setItem('user_email', email);
    
    setTimeout(() => {
      setIsSaving(false);
      alert('Profile updated successfully!');
    }, 500);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">My Account</h1>
          <p className="text-stone-500 mt-2">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
                <Button onClick={handleSave} disabled={isSaving} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>

            {/* Account Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Account Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Trade Account</p>
                    <p className="text-sm text-stone-500">Apply for trade pricing and benefits</p>
                  </div>
                  <Link href="/trade/register">
                    <Button variant="outline">Apply</Button>
                  </Link>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Order History</p>
                    <p className="text-sm text-stone-500">View your past orders</p>
                  </div>
                  <Button variant="outline" disabled>Coming Soon</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Account Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-stone-200 flex items-center justify-center">
                    <User className="h-6 w-6 text-stone-600" />
                  </div>
                  <div>
                    <p className="font-medium">{name || 'User'}</p>
                    <p className="text-sm text-stone-500">{email}</p>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-stone-600">Account Type</span>
                    <Badge variant="outline">Customer</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-stone-600">Member Since</span>
                    <span className="text-sm text-stone-900">
                      {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/favorites" className="block">
                  <Button variant="ghost" className="w-full justify-start">
                    Favorites
                  </Button>
                </Link>
                <Link href="/cart" className="block">
                  <Button variant="ghost" className="w-full justify-start">
                    Shopping Cart
                  </Button>
                </Link>
                <Link href="/products" className="block">
                  <Button variant="ghost" className="w-full justify-start">
                    Browse Products
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Logout */}
            <Card>
              <CardContent className="pt-6">
                <Button 
                  variant="outline" 
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Log Out
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

