"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, ShoppingCart, Package, Pencil, Trash2, Sparkles } from 'lucide-react';
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

interface SweetCardProps {
  sweet: Sweet;
  onPurchase?: (sweet: Sweet) => void;
  onEdit?: (sweet: Sweet) => void;
  onDelete?: (sweet: Sweet) => void;
  onRestock?: (sweet: Sweet) => void;
}

const categoryColors: Record<string, string> = {
  'Chocolate': 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-200',
  'Gummy': 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg shadow-red-200',
  'Hard Candy': 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-200',
  'Lollipop': 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-200',
  'Sour Candy': 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-200',
  'Licorice': 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-200',
  'Marshmallow': 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg shadow-cyan-200',
  'Indian Sweet': 'bg-gradient-to-r from-orange-500 to-rose-600 text-white shadow-lg shadow-orange-200',
};

const categoryBackgrounds: Record<string, string> = {
  'Chocolate': 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/d135585a-f759-46ed-86f3-d20a0e4453c6/generated_images/chocolate-candy-background-pattern-rich--b9e99b5c-20251115163134.jpg',
  'Gummy': 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/d135585a-f759-46ed-86f3-d20a0e4453c6/generated_images/colorful-gummy-candy-background-pattern--7713f331-20251115163132.jpg',
  'Hard Candy': 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/d135585a-f759-46ed-86f3-d20a0e4453c6/generated_images/hard-candy-lollipop-background-pattern-r-cad681e7-20251115163131.jpg',
  'Lollipop': 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/d135585a-f759-46ed-86f3-d20a0e4453c6/generated_images/hard-candy-lollipop-background-pattern-r-cad681e7-20251115163131.jpg',
  'Sour Candy': 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/d135585a-f759-46ed-86f3-d20a0e4453c6/generated_images/colorful-gummy-candy-background-pattern--7713f331-20251115163132.jpg',
  'Licorice': 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/d135585a-f759-46ed-86f3-d20a0e4453c6/generated_images/chocolate-candy-background-pattern-rich--b9e99b5c-20251115163134.jpg',
  'Marshmallow': 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/d135585a-f759-46ed-86f3-d20a0e4453c6/generated_images/hard-candy-lollipop-background-pattern-r-cad681e7-20251115163131.jpg',
  'Indian Sweet': 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/d135585a-f759-46ed-86f3-d20a0e4453c6/generated_images/sweet-shop-display-background-with-color-86dd72f8-20251115163134.jpg',
};

export function SweetCard({ sweet, onPurchase, onEdit, onDelete, onRestock }: SweetCardProps) {
  const { isAuthenticated, isAdmin, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      setError('Please login to purchase');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/sweets/${sweet.id}/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: 1 }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Purchase failed');
      }

      const data = await response.json();
      setSuccess(`Successfully purchased! Total: ₹${data.totalCost}`);
      
      if (onPurchase) {
        onPurchase(data.sweet);
      }
    } catch (err: any) {
      setError(err.message || 'Purchase failed');
    } finally {
      setLoading(false);
    }
  };

  const categoryColor = categoryColors[sweet.category] || 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
  const categoryBg = categoryBackgrounds[sweet.category] || categoryBackgrounds['Gummy'];
  const isOutOfStock = sweet.quantity === 0;

  return (
    <Card className={`group relative overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-105 border-4 border-white shadow-xl ${isOutOfStock ? 'opacity-70 grayscale' : 'hover:border-purple-400'}`}>
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-100/80 via-purple-100/80 to-blue-100/80 group-hover:from-pink-200/90 group-hover:via-purple-200/90 group-hover:to-blue-200/90 transition-all duration-500" />
      
      {/* Sparkle effect on hover */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
        <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse drop-shadow-lg" />
      </div>

      {/* Product Image Section */}
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 border-b-4 border-white">
        {sweet.imageUrl ? (
          <img
            src={sweet.imageUrl}
            alt={sweet.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div 
            className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
            style={{ backgroundImage: `url('${categoryBg}')` }}
          />
        )}
        {/* Gradient overlay on image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        
        {/* Category Badge on Image */}
        <div className="absolute top-3 left-3 z-10">
          <Badge className={`${categoryColor} border-2 border-white px-4 py-2 text-xs font-black tracking-wide shadow-xl`}>
            {sweet.category}
          </Badge>
        </div>
        
        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
            <div className="bg-red-600 text-white px-6 py-3 rounded-full font-black text-lg shadow-2xl border-4 border-white transform rotate-12">
              OUT OF STOCK
            </div>
          </div>
        )}
      </div>

      <CardHeader className="relative z-10 pb-3">
        <CardTitle className="text-2xl font-black bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent group-hover:from-pink-700 group-hover:to-purple-700 transition-all drop-shadow-sm">
          {sweet.name}
        </CardTitle>
        <CardDescription className="mt-2 text-gray-700 font-semibold text-sm line-clamp-2">
          {sweet.description || 'Delicious sweet treat 🍬'}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-3 relative z-10 pb-4">
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-200 to-pink-200 rounded-2xl border-4 border-white shadow-lg">
          <div className="flex flex-col">
            <span className="text-xs text-purple-900 font-bold uppercase tracking-wide">Price</span>
            <span className="text-4xl font-black bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent drop-shadow-sm">
              ₹{sweet.price.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center gap-3 bg-white/90 px-4 py-3 rounded-xl shadow-lg border-2 border-purple-200">
            <Package className={`h-6 w-6 ${isOutOfStock ? 'text-red-600' : 'text-purple-600'}`} />
            <div className="flex flex-col items-end">
              <span className="text-xs text-gray-600 font-bold uppercase">Stock</span>
              <span className={`text-2xl font-black ${isOutOfStock ? 'text-red-700' : 'text-purple-700'}`}>
                {sweet.quantity}
              </span>
            </div>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="border-3 animate-in fade-in slide-in-from-top-2 shadow-lg">
            <AlertDescription className="font-bold">{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-3 border-green-600 text-green-800 bg-gradient-to-r from-green-100 to-emerald-100 animate-in fade-in slide-in-from-top-2 shadow-lg">
            <AlertDescription className="font-bold">{success}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col gap-2 relative z-10 pt-2">
        <Button
          className="w-full bg-black hover:bg-gray-900 text-white font-black shadow-2xl hover:shadow-black/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed border-2 border-white text-base py-6"
          onClick={handlePurchase}
          disabled={loading || isOutOfStock || !isAuthenticated}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Purchasing...
            </>
          ) : (
            <>
              <ShoppingCart className="mr-2 h-5 w-5" />
              {isOutOfStock ? '❌ Out of Stock' : isAuthenticated ? '🛒 Purchase' : '🔒 Login to Purchase'}
            </>
          )}
        </Button>

        {isAdmin && (
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              size="icon"
              className="flex-1 border-3 border-blue-400 hover:bg-blue-100 hover:border-blue-500 hover:text-blue-700 transition-all shadow-lg h-12"
              onClick={() => onEdit?.(sweet)}
            >
              <Pencil className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="flex-1 border-3 border-green-400 hover:bg-green-100 hover:border-green-500 hover:text-green-700 transition-all shadow-lg h-12"
              onClick={() => onRestock?.(sweet)}
            >
              <Package className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="flex-1 border-3 border-red-400 hover:bg-red-100 hover:border-red-500 hover:text-red-700 transition-all shadow-lg h-12"
              onClick={() => onDelete?.(sweet)}
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}