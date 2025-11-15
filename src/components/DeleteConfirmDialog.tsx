"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertTriangle, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Sweet {
  id: number;
  name: string;
}

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sweet: Sweet | null;
  onSuccess: () => void;
}

export function DeleteConfirmDialog({ open, onOpenChange, sweet, onSuccess }: DeleteConfirmDialogProps) {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (!sweet) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/sweets/${sweet.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Delete failed');
      }

      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message || 'Delete failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-white via-red-50/30 to-orange-50/30 border-2 border-red-200">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-red-500 to-orange-500 p-2 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent flex items-center gap-2">
                Delete Sweet
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                This action cannot be undone
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          {error && (
            <Alert variant="destructive" className="border-2 animate-in fade-in">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border-2 border-red-200">
            <p className="text-sm font-medium text-red-900 mb-2">You are about to delete:</p>
            <p className="text-xl font-bold text-red-700">"{sweet?.name}"</p>
            <p className="text-sm text-red-600 mt-2">This sweet will be permanently removed from your inventory.</p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading} className="border-2">
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete} 
            disabled={loading}
            className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white font-semibold shadow-lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}