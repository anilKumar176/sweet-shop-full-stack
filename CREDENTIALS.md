# 🔐 Sweet Shop User Credentials

This document contains all the pre-configured user accounts for testing different roles in the Sweet Shop Management System.

## 👑 Super Admin Account

**Email:** `superadmin@sweetshop.com`  
**Password:** `admin123`  
**Access Level:** Full system access - Can manage all users, assign roles, and delete accounts

**Features:**
- ✅ Access to Super Admin Dashboard (`/dashboard/super-admin`)
- ✅ View all users with search and filtering
- ✅ Change user roles (User ↔ Admin ↔ Super Admin)
- ✅ Delete user accounts (except own account)
- ✅ Full CRUD operations on sweets inventory
- ✅ Restock products
- ✅ View analytics and statistics

---

## ⭐ Admin Accounts

### Admin One
**Email:** `admin1@sweetshop.com`  
**Password:** `admin123`  
**Access Level:** Management access - Can manage inventory

### Admin Two
**Email:** `admin2@sweetshop.com`  
**Password:** `admin123`  
**Access Level:** Management access - Can manage inventory

### Admin Three
**Email:** `admin3@sweetshop.com`  
**Password:** `admin123`  
**Access Level:** Management access - Can manage inventory

**Features:**
- ✅ Access to Admin Dashboard (`/dashboard/admin`)
- ✅ Add new sweets to inventory
- ✅ Edit existing sweet details
- ✅ Delete sweets from inventory
- ✅ Restock products
- ✅ View inventory statistics
- ❌ Cannot manage users or change roles

---

## 👤 Regular User Accounts

### Regular User One
**Email:** `user1@sweetshop.com`  
**Password:** `user123`  
**Access Level:** Standard access - Can browse and purchase

### Regular User Two
**Email:** `user2@sweetshop.com`  
**Password:** `user123`  
**Access Level:** Standard access - Can browse and purchase

**Features:**
- ✅ Access to User Dashboard (`/dashboard/user`)
- ✅ Browse sweet catalog
- ✅ Search and filter sweets
- ✅ Purchase sweets (reduces quantity)
- ✅ View personal statistics
- ❌ Cannot manage inventory
- ❌ Cannot manage users

---

## 🎯 Quick Test Guide

### Testing Super Admin Features:
1. Login with `superadmin@sweetshop.com` / `admin123`
2. Navigate to Dashboard → Should show "Super Admin Dashboard"
3. Manage users: Change roles, delete accounts
4. Try to delete your own account (should be prevented)

### Testing Admin Features:
1. Login with `admin1@sweetshop.com` / `admin123`
2. Navigate to Dashboard → Should show "Admin Dashboard"
3. Add/Edit/Delete sweets from inventory
4. Restock low-stock items

### Testing Regular User Features:
1. Login with `user1@sweetshop.com` / `user123`
2. Navigate to Dashboard → Should show "User Dashboard"
3. Browse and purchase sweets
4. View personal statistics

---

## 🔒 Security Notes

- All passwords are hashed using bcrypt before storage
- JWT tokens are used for authentication
- Role-based access control prevents unauthorized actions
- Super admin accounts cannot delete themselves
- **⚠️ Change these default credentials in production!**

---

## 📊 Role Comparison

| Feature | Super Admin | Admin | User |
|---------|------------|-------|------|
| Browse & Purchase Sweets | ✅ | ✅ | ✅ |
| View Own Dashboard | ✅ | ✅ | ✅ |
| Add/Edit/Delete Sweets | ✅ | ✅ | ❌ |
| Restock Products | ✅ | ✅ | ❌ |
| View All Users | ✅ | ❌ | ❌ |
| Change User Roles | ✅ | ❌ | ❌ |
| Delete User Accounts | ✅ | ❌ | ❌ |

---

## 🚀 Getting Started

1. Start the application: `bun run dev`
2. Open http://localhost:3000
3. Click "Login" button in the navbar
4. Choose any account from above to test different features
5. Each role redirects to their appropriate dashboard automatically

Enjoy testing! 🍬✨
