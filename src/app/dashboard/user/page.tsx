"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, Heart, Clock, TrendingUp, Candy, ArrowLeft, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Sweet {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  imageUrl?: string | null;
}

interface PurchaseStats {
  totalPurchases: number;
  favoriteCategory: string;
  recentActivity: number;
}

export default function UserDashboard() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats] = useState<PurchaseStats>({
    totalPurchases: 0,
    favoriteCategory: 'Chocolate',
    recentActivity: 0,
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    const fetchSweets = async () => {
      try {
        const response = await fetch('/api/sweets');
        if (!response.ok) throw new Error('Failed to fetch sweets');
        const data = await response.json();
        setSweets(data.sweets.slice(0, 6)); // Show top 6 sweets
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchSweets();
    }
  }, [isAuthenticated]);

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `url('https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/d135585a-f759-46ed-86f3-d20a0e4453c6/generated_images/soft-pastel-candy-themed-seamless-patter-3166ed04-20251115162421.jpg')`
      }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]" />
      
      {/* Hero Section */}
      <div className="relative">
        <div className="container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/')}
            className="mb-4 bg-white/80 hover:bg-white shadow-md"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Shop
          </Button>
          
          <div className="bg-gradient-to-r from-pink-500/90 to-purple-600/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white">
              Welcome back, {user?.name}! 🍭
            </h1>
            <p className="text-lg md:text-xl text-white/90">
              Your personal candy paradise awaits
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative container mx-auto px-4 pb-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/90 backdrop-blur-md border-2 border-pink-200 hover:shadow-2xl transition-all hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Purchases
              </CardTitle>
              <ShoppingBag className="h-5 w-5 text-pink-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                {stats.totalPurchases}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Lifetime purchases
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-md border-2 border-purple-200 hover:shadow-2xl transition-all hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Favorite Category
              </CardTitle>
              <Heart className="h-5 w-5 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {stats.favoriteCategory}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Most purchased
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-md border-2 border-blue-200 hover:shadow-2xl transition-all hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Recent Activity
              </CardTitle>
              <Clock className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {stats.recentActivity}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Last 7 days
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8 bg-white/90 backdrop-blur-md shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Explore trending sweets and special offers
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-24 flex-col gap-2 hover:bg-pink-50 hover:border-pink-300 bg-white/80"
              onClick={() => router.push('/?category=Chocolate')}
            >
              <Candy className="h-8 w-8 text-amber-600" />
              <span>Chocolate</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex-col gap-2 hover:bg-red-50 hover:border-red-300 bg-white/80"
              onClick={() => router.push('/?category=Gummy')}
            >
              <Candy className="h-8 w-8 text-red-600" />
              <span>Gummy</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex-col gap-2 hover:bg-purple-50 hover:border-purple-300 bg-white/80"
              onClick={() => router.push('/?category=Lollipop')}
            >
              <Candy className="h-8 w-8 text-purple-600" />
              <span>Lollipop</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex-col gap-2 hover:bg-green-50 hover:border-green-300 bg-white/80"
              onClick={() => router.push('/')}
            >
              <ShoppingBag className="h-8 w-8 text-green-600" />
              <span>View All</span>
            </Button>
          </CardContent>
        </Card>

        {/* Featured Sweets */}
        <Card className="bg-white/90 backdrop-blur-md shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Candy className="h-5 w-5 text-pink-600" />
              Featured Sweets
            </CardTitle>
            <CardDescription>
              Popular picks just for you
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {sweets.map((sweet) => (
                  <div
                    key={sweet.id}
                    className="group cursor-pointer rounded-lg border-2 border-transparent hover:border-pink-300 transition-all p-3 hover:bg-pink-50 bg-white/80"
                    onClick={() => router.push('/')}
                  >
                    <div className="aspect-square bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg mb-2 flex items-center justify-center">
                      <Candy className="h-12 w-12 text-purple-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <h4 className="font-semibold text-sm mb-1 group-hover:text-pink-600 transition-colors">
                      {sweet.name}
                    </h4>
                    <p className="text-xs text-muted-foreground mb-1">{sweet.category}</p>
                    <p className="font-bold text-purple-600">₹{sweet.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}