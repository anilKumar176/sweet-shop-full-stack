"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Package, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Sweet {
  id: number;
  name: string;
  quantity: number;
}

interface RestockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sweet: Sweet | null;
  onSuccess: () => void;
}

export function RestockDialog({ open, onOpenChange, sweet, onSuccess }: RestockDialogProps) {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState('10');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sweet) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/sweets/${sweet.id}/restock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: parseInt(quantity) }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Restock failed');
      }

      onSuccess();
      onOpenChange(false);
      setQuantity('10');
    } catch (err: any) {
      setError(err.message || 'Restock failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-white via-green-50/30 to-emerald-50/30 border-2 border-green-200">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-2 rounded-lg">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Restock Sweet
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Add more inventory for {sweet?.name}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {error && (
              <Alert variant="destructive" className="border-2 animate-in fade-in">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200">
              <Label className="text-sm font-semibold text-blue-900">Current Stock</Label>
              <div className="flex items-center gap-2">
                <Package className="h-6 w-6 text-blue-600" />
                <div className="text-3xl font-bold text-blue-600">{sweet?.quantity || 0}</div>
                <span className="text-sm text-blue-700 font-medium">units</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-sm font-semibold text-green-900">Quantity to Add</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                disabled={loading}
                className="border-2 focus:border-green-400 focus:ring-green-400 text-lg font-semibold"
              />
            </div>

            <div className="space-y-2 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
              <Label className="text-sm font-semibold text-green-900 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                New Total Stock
              </Label>
              <div className="flex items-center gap-2">
                <Package className="h-6 w-6 text-green-600" />
                <div className="text-3xl font-bold text-green-600">
                  {(sweet?.quantity || 0) + parseInt(quantity || '0')}
                </div>
                <span className="text-sm text-green-700 font-medium">units</span>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading} className="border-2">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold shadow-lg">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Restocking...
                </>
              ) : (
                <>
                  <Package className="mr-2 h-4 w-4" />
                  Restock
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}