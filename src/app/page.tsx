"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SweetCard } from '@/components/SweetCard';
import { SweetForm } from '@/components/SweetForm';
import { RestockDialog } from '@/components/RestockDialog';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import { AuthDialog } from '@/components/AuthDialog';
import { Search, Plus, LogIn, LogOut, User, Loader2, Filter, LayoutDashboard, Candy, UserPlus } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Sweet {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  description?: string | null;
  imageUrl?: string | null;
}

export default function Home() {
  const { user, isAuthenticated, isAdmin, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [filteredSweets, setFilteredSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authDialogView, setAuthDialogView] = useState<'login' | 'register'>('login');
  const [sweetFormOpen, setSweetFormOpen] = useState(false);
  const [restockDialogOpen, setRestockDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSweet, setSelectedSweet] = useState<Sweet | null>(null);

  const fetchSweets = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/sweets');
      
      if (!response.ok) {
        throw new Error('Failed to fetch sweets');
      }
      
      const data = await response.json();
      setSweets(data.sweets);
      setFilteredSweets(data.sweets);
    } catch (err: any) {
      setError(err.message || 'Failed to load sweets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  useEffect(() => {
    let filtered = sweets;

    if (searchTerm) {
      filtered = filtered.filter(sweet =>
        sweet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sweet.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(sweet => sweet.category === categoryFilter);
    }

    if (priceRange.min) {
      filtered = filtered.filter(sweet => sweet.price >= parseFloat(priceRange.min));
    }

    if (priceRange.max) {
      filtered = filtered.filter(sweet => sweet.price <= parseFloat(priceRange.max));
    }

    setFilteredSweets(filtered);
  }, [searchTerm, categoryFilter, priceRange, sweets]);

  const categories = Array.from(new Set(sweets.map(s => s.category)));

  const handleEdit = (sweet: Sweet) => {
    setSelectedSweet(sweet);
    setSweetFormOpen(true);
  };

  const handleDelete = (sweet: Sweet) => {
    setSelectedSweet(sweet);
    setDeleteDialogOpen(true);
  };

  const handleRestock = (sweet: Sweet) => {
    setSelectedSweet(sweet);
    setRestockDialogOpen(true);
  };

  const handleAddNew = () => {
    setSelectedSweet(null);
    setSweetFormOpen(true);
  };

  const handleDashboardClick = () => {
    if (isAdmin) {
      router.push('/dashboard/admin');
    } else {
      router.push('/dashboard/user');
    }
  };

  const handleLoginClick = () => {
    setAuthDialogView('login');
    setAuthDialogOpen(true);
  };

  const handleRegisterClick = () => {
    setAuthDialogView('register');
    setAuthDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
      {/* Header */}
      <header className="border-b-4 border-gray-800 bg-black sticky top-0 z-50 shadow-2xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-black p-3 rounded-2xl shadow-lg border-2 border-white">
                <Image 
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/d135585a-f759-46ed-86f3-d20a0e4453c6/generated_images/professional-indian-sweet-shop-logo-icon-e7842c52-20251115171458.jpg"
                  alt="Indian Sweet Shop"
                  width={32}
                  height={32}
                  className="h-8 w-8 object-contain"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white drop-shadow-lg">
                  Sweet Shop
                </h1>
                <p className="text-xs text-orange-300 font-semibold">Mithai Store 🪔</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <Button
                    onClick={handleDashboardClick}
                    variant="outline"
                    size="sm"
                    className="hidden sm:flex bg-white/90 hover:bg-white border-2 border-white text-black font-semibold"
                  >
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/90 rounded-full shadow-lg">
                    <User className="h-5 w-5 text-purple-600" />
                    <span className="font-bold text-purple-900">{user?.name}</span>
                    {isAdmin && (
                      <span className="text-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full font-bold">
                        ⭐ Admin
                      </span>
                    )}
                  </div>
                  <Button onClick={logout} variant="outline" size="sm" className="bg-white/90 hover:bg-white border-2 border-white text-black font-semibold">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <Button onClick={handleLoginClick} variant="outline" className="bg-white/90 text-black hover:bg-white border-2 border-white font-bold shadow-lg">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div 
          className="mb-8 text-center relative rounded-3xl overflow-hidden p-16 bg-cover bg-center shadow-2xl border-4 border-white"
          style={{
            backgroundImage: `url('https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/d135585a-f759-46ed-86f3-d20a0e4453c6/generated_images/sweet-shop-display-background-with-color-86dd72f8-20251115163134.jpg')`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-pink-500/60 via-purple-500/60 to-blue-500/60 backdrop-blur-sm" />
          <div className="relative z-10">
            <h2 className="text-5xl md:text-6xl font-black mb-4 text-white drop-shadow-2xl animate-pulse">
              🪔 Discover Authentic Indian Sweets 🍬
            </h2>
            <p className="text-xl text-white max-w-2xl mx-auto font-bold drop-shadow-lg">
              Browse our exquisite collection of traditional Indian mithai - from classic Gulab Jamun to premium Kaju Katli
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 bg-gradient-to-br from-white to-pink-50 rounded-3xl shadow-2xl p-8 border-4 border-purple-200">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-2xl">
              <Filter className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-black text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Search & Filter</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-500" />
              <Input
                placeholder="Search sweets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-3 border-purple-300 focus:border-purple-500 bg-white font-medium"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="border-3 border-purple-300 bg-white font-medium">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="number"
              placeholder="Min price"
              value={priceRange.min}
              onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
              step="0.01"
              className="border-3 border-purple-300 focus:border-purple-500 bg-white font-medium"
            />

            <Input
              type="number"
              placeholder="Max price"
              value={priceRange.max}
              onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
              step="0.01"
              className="border-3 border-purple-300 focus:border-purple-500 bg-white font-medium"
            />
          </div>

          {isAdmin && (
            <div className="mt-6 pt-6 border-t-2 border-purple-200">
              <Button onClick={handleAddNew} className="w-full md:w-auto bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold shadow-xl text-lg py-6">
                <Plus className="h-5 w-5 mr-2" />
                Add New Sweet
              </Button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4 shadow-lg border-2 border-purple-200">
          <p className="text-purple-900 font-bold text-lg">
            Showing <span className="text-2xl text-purple-600">{filteredSweets.length}</span> of{' '}
            <span className="text-2xl text-pink-600">{sweets.length}</span> sweets
          </p>
          
          {(searchTerm || categoryFilter !== 'all' || priceRange.min || priceRange.max) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('all');
                setPriceRange({ min: '', max: '' });
              }}
              className="bg-white border-2 border-purple-300 hover:bg-purple-50 font-semibold"
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive" className="mb-6 border-3">
            <AlertDescription className="font-semibold">{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl">
            <Loader2 className="h-16 w-16 animate-spin text-purple-600 mb-4" />
            <p className="text-xl font-bold text-purple-600">Loading sweet treats...</p>
          </div>
        ) : filteredSweets.length === 0 ? (
          <div className="text-center py-20 bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl">
            <Candy className="h-24 w-24 mx-auto mb-4 text-purple-300" />
            <h3 className="text-3xl font-bold mb-2 text-purple-600">No sweets found</h3>
            <p className="text-lg text-purple-500 font-medium">
              {searchTerm || categoryFilter !== 'all' || priceRange.min || priceRange.max
                ? 'Try adjusting your filters'
                : 'Check back soon for new treats!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredSweets.map((sweet) => (
              <SweetCard
                key={sweet.id}
                sweet={sweet}
                onPurchase={(updatedSweet) => {
                  setSweets(sweets.map(s => s.id === updatedSweet.id ? updatedSweet : s));
                }}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onRestock={handleRestock}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-purple-300 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-white">
          <p className="mb-2 text-xl font-bold">🪔 Indian Sweet Shop Management System 🍬</p>
          <p className="text-sm text-pink-100 font-medium">Traditional Indian Mithai & Sweets</p>
        </div>
      </footer>

      {/* Dialogs */}
      <AuthDialog
        open={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
        defaultView={authDialogView}
      />

      <SweetForm
        open={sweetFormOpen}
        onOpenChange={setSweetFormOpen}
        sweet={selectedSweet}
        onSuccess={fetchSweets}
      />

      <RestockDialog
        open={restockDialogOpen}
        onOpenChange={setRestockDialogOpen}
        sweet={selectedSweet}
        onSuccess={fetchSweets}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        sweet={selectedSweet}
        onSuccess={fetchSweets}
      />
    </div>
  );
}