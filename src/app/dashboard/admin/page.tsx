"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Package, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Candy,
  ArrowLeft,
  Loader2,
  ShoppingCart,
  AlertTriangle,
  BarChart3
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Sweet {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

interface DashboardStats {
  totalProducts: number;
  totalRevenue: number;
  lowStockItems: number;
  totalCategories: number;
}

export default function AdminDashboard() {
  const { user, isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalRevenue: 0,
    lowStockItems: 0,
    totalCategories: 0,
  });

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin)) {
      router.push('/');
    }
  }, [authLoading, isAuthenticated, isAdmin, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/sweets');
        if (!response.ok) throw new Error('Failed to fetch sweets');
        
        const data = await response.json();
        const sweetsData = data.sweets;
        setSweets(sweetsData);

        // Calculate stats
        const categories = new Set(sweetsData.map((s: Sweet) => s.category));
        const lowStock = sweetsData.filter((s: Sweet) => s.quantity < 10);
        const revenue = sweetsData.reduce((sum: number, s: Sweet) => sum + (s.price * s.quantity), 0);

        setStats({
          totalProducts: sweetsData.length,
          totalRevenue: revenue,
          lowStockItems: lowStock.length,
          totalCategories: categories.size,
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && isAdmin) {
      fetchData();
    }
  }, [isAuthenticated, isAdmin]);

  if (authLoading || !isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Loader2 className="h-12 w-12 animate-spin text-purple-400" />
      </div>
    );
  }

  const lowStockSweets = sweets.filter(s => s.quantity < 10).slice(0, 5);
  const categoryBreakdown = sweets.reduce((acc, sweet) => {
    acc[sweet.category] = (acc[sweet.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `url('https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/d135585a-f759-46ed-86f3-d20a0e4453c6/generated_images/dark-elegant-geometric-pattern-backgroun-af6721a2-20251115162421.jpg')`
      }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[1px]" />
      
      {/* Hero Section */}
      <div className="relative">
        <div className="container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/')}
            className="mb-4 bg-slate-800/80 text-white hover:bg-slate-700 shadow-lg border border-purple-500/30"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Shop
          </Button>
          
          <div className="bg-gradient-to-r from-purple-600/90 to-blue-600/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl mb-8 border border-purple-400/30">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-3 rounded-xl shadow-lg">
                <BarChart3 className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  Admin Dashboard
                </h1>
                <p className="text-lg md:text-xl text-white/90 mt-1">
                  Welcome, {user?.name} - Manage your sweet shop
                </p>
              </div>
            </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 hover:shadow-2xl transition-all hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium opacity-90">
                Total Products
              </CardTitle>
              <Package className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs opacity-80 mt-1">
                Active sweet items
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 hover:shadow-2xl transition-all hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium opacity-90">
                Total Value
              </CardTitle>
              <DollarSign className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">₹{stats.totalRevenue.toFixed(2)}</div>
              <p className="text-xs opacity-80 mt-1">
                Inventory value
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-0 hover:shadow-2xl transition-all hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium opacity-90">
                Low Stock
              </CardTitle>
              <AlertTriangle className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{stats.lowStockItems}</div>
              <p className="text-xs opacity-80 mt-1">
                Items need restocking
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 hover:shadow-2xl transition-all hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium opacity-90">
                Categories
              </CardTitle>
              <TrendingUp className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{stats.totalCategories}</div>
              <p className="text-xs opacity-80 mt-1">
                Product categories
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Low Stock Alert */}
          <Card className="bg-slate-800/90 backdrop-blur-md border-amber-500/30 shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Low Stock Alert
              </CardTitle>
              <CardDescription className="text-slate-400">
                Items that need immediate restocking
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
                </div>
              ) : lowStockSweets.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>All products are well stocked!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {lowStockSweets.map((sweet) => (
                    <div
                      key={sweet.id}
                      className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg border border-slate-600/50 hover:border-amber-500/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-2 rounded-lg">
                          <Candy className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">{sweet.name}</p>
                          <p className="text-xs text-slate-400">{sweet.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-amber-500">{sweet.quantity}</p>
                        <p className="text-xs text-slate-400">in stock</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <Card className="bg-slate-800/90 backdrop-blur-md border-purple-500/30 shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <BarChart3 className="h-5 w-5 text-purple-500" />
                Category Breakdown
              </CardTitle>
              <CardDescription className="text-slate-400">
                Distribution of products by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(categoryBreakdown).map(([category, count]) => (
                    <div key={category}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white">{category}</span>
                        <span className="text-sm text-slate-400">{count} items</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all"
                          style={{ width: `${(count / stats.totalProducts) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-6 bg-slate-800/90 backdrop-blur-md border-blue-500/30 shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <ShoppingCart className="h-5 w-5 text-blue-500" />
              Quick Actions
            </CardTitle>
            <CardDescription className="text-slate-400">
              Manage your sweet shop inventory
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              className="h-24 flex-col gap-2 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
              onClick={() => router.push('/')}
            >
              <Package className="h-8 w-8" />
              <span>View All</span>
            </Button>
            <Button
              className="h-24 flex-col gap-2 bg-gradient-to-br from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-lg"
              onClick={() => router.push('/')}
            >
              <TrendingUp className="h-8 w-8" />
              <span>Add New</span>
            </Button>
            <Button
              className="h-24 flex-col gap-2 bg-gradient-to-br from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 shadow-lg"
              onClick={() => router.push('/')}
            >
              <AlertTriangle className="h-8 w-8" />
              <span>Restock</span>
            </Button>
            <Button
              className="h-24 flex-col gap-2 bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg"
              onClick={() => router.push('/')}
            >
              <BarChart3 className="h-8 w-8" />
              <span>Analytics</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}