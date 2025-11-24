# 🔐 Admin Access Guide - My Right Window

## ✅ CURRENT STATUS

Your admin system is **FULLY CONFIGURED** and ready to use!

### Database Setup:
- ✅ `user_profiles` table exists
- ✅ Admin user exists in database
- ✅ Row Level Security (RLS) policies configured
- ✅ Admin role properly assigned

---

## 👤 EXISTING ADMIN USER

### Admin Profile in Database:
```
Email: vk8973675@gmail.com
Role: admin
Full Name: Vikas Kumar
User ID: 6000eaab-6902-4a6c-9d9b-70087341830e
```

---

## 🚪 HOW TO ACCESS ADMIN DASHBOARD

### Option 1: Use Existing Admin Account (If You Know the Password)

**Login URL**: `https://[your-site].netlify.app/admin/login`

**Credentials**:
- Email: `vk8973675@gmail.com`
- Password: `[Your existing password]`

If you **don't remember the password**, follow Option 2 below.

---

### Option 2: Reset Password for Existing Admin

#### METHOD A: Reset via Supabase Dashboard (Recommended)

1. **Go to Supabase Dashboard**:
   - Visit: https://supabase.com/dashboard/project/tvwfrxndpxxdrtlaemak
   - Click "Authentication" → "Users"

2. **Find Your Admin User**:
   - Look for user with email: `vk8973675@gmail.com`
   - User ID: `6000eaab-6902-4a6c-9d9b-70087341830e`

3. **Reset Password**:
   - Click on the user row
   - Click "Reset Password" or "Send Magic Link"
   - OR click "Edit User" → Set new password manually
   - Recommended new password: `Admin@2024!Secure`

4. **Login**:
   - Go to: `https://[your-site].netlify.app/admin/login`
   - Email: `vk8973675@gmail.com`
   - Password: `[Your new password]`

#### METHOD B: Reset via SQL (Quick Method)

1. **Go to Supabase SQL Editor**:
   - https://supabase.com/dashboard/project/tvwfrxndpxxdrtlaemak/sql

2. **Run this SQL** (replace with your desired password):
   ```sql
   -- Update password for admin user
   UPDATE auth.users 
   SET encrypted_password = crypt('YourNewPassword123!', gen_salt('bf'))
   WHERE id = '6000eaab-6902-4a6c-9d9b-70087341830e';
   ```

3. **Login**:
   - Email: `vk8973675@gmail.com`
   - Password: `YourNewPassword123!` (whatever you set)

---

### Option 3: Create a New Admin Account

If you prefer a different email address:

#### Step 1: Create User in Supabase Auth

1. **Go to Supabase Dashboard**:
   - https://supabase.com/dashboard/project/tvwfrxndpxxdrtlaemak
   - Click "Authentication" → "Users"

2. **Create New User**:
   - Click "Add User" button
   - Select "Create new user"
   - Email: `admin@myrightwindow.com` (or any email you prefer)
   - Password: `Admin@2024!MRW`
   - Click "Create User"

3. **Copy the User ID**:
   - After creation, you'll see the new user in the list
   - Copy their UUID (e.g., `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)

#### Step 2: Add Admin Role

1. **Go to SQL Editor**:
   - Click "SQL Editor" in left sidebar

2. **Run this SQL** (replace `YOUR-USER-ID` with the copied UUID):
   ```sql
   -- Add new admin to user_profiles
   INSERT INTO user_profiles (id, email, role, full_name)
   VALUES (
     'YOUR-USER-ID',
     'admin@myrightwindow.com',
     'admin',
     'Admin User'
   );
   ```

3. **Verify**:
   ```sql
   SELECT * FROM user_profiles WHERE role = 'admin';
   ```

#### Step 3: Login

- Go to: `https://[your-site].netlify.app/admin/login`
- Email: `admin@myrightwindow.com`
- Password: `Admin@2024!MRW`

---

## 🎯 ADMIN DASHBOARD FEATURES

Once logged in, you can access:

### 1. **Dashboard** (`/admin/dashboard`)
- View all blog posts
- See publish status (Published/Draft)
- Quick stats overview

### 2. **Create Blog** (`/admin/create`)
- Rich text editor
- Image upload (multiple)
- PDF attachment
- Tags management
- SEO-friendly slug
- Publish/Draft toggle

### 3. **Edit Blog** (`/admin/edit/:id`)
- Edit existing posts
- Update images
- Change publish status
- Delete posts (with confirmation)

### 4. **Settings** (`/admin/settings`)
- Update your name
- Change password
- View account info

### 5. **Logout**
- Secure sign out
- Redirects to login page

---

## 🔒 SECURITY FEATURES

### Authentication Flow:
1. User enters email/password
2. System authenticates with Supabase Auth
3. System checks `user_profiles` table for admin role
4. If not admin → Sign out + Error message
5. If admin → Redirect to dashboard

### Route Protection:
- All `/admin/*` routes (except `/admin/login`) are protected
- Unauthenticated users → Redirected to login
- Non-admin users → Cannot access even if logged in

### Database Security (RLS Policies):
- ✅ Users can view their own profile
- ✅ Users can update their own profile
- ✅ Admins can view all profiles
- ✅ Public can read published blogs
- ✅ Only admins can create/update/delete blogs

---

## 🧪 TESTING ADMIN ACCESS

### Step-by-Step Test:

1. **Test Login Page**:
   ```
   URL: https://[your-site].netlify.app/admin/login
   Check: Login form displays correctly
   ```

2. **Test Authentication**:
   ```
   Email: vk8973675@gmail.com (or your new admin email)
   Password: [Your password]
   Expected: Redirects to dashboard
   ```

3. **Test Dashboard**:
   ```
   URL: https://[your-site].netlify.app/admin/dashboard
   Check: See list of blog posts
   Check: See "Create New Blog Post" button
   ```

4. **Test Create Blog**:
   ```
   Click: "Create New Blog Post"
   Fill: Title, content, tags
   Action: Save as draft or publish
   Expected: New blog appears in list
   ```

5. **Test Edit Blog**:
   ```
   Click: "Edit" on any blog
   Change: Update title or content
   Action: Save changes
   Expected: Changes persist
   ```

6. **Test Delete Blog**:
   ```
   Click: "Delete" on any blog
   Check: Confirmation modal appears
   Action: Confirm delete
   Expected: Blog removed from list
   ```

7. **Test Settings**:
   ```
   Navigate: Settings page
   Change: Update your name
   Change: Update password
   Expected: Changes saved successfully
   ```

8. **Test Logout**:
   ```
   Click: Logout button
   Expected: Redirected to login page
   Check: Cannot access dashboard without logging in again
   ```

9. **Test Non-Admin Prevention**:
   ```
   Create: Regular user (without admin role)
   Try: Login with that user
   Expected: Error "Unauthorized: Admin access required"
   ```

---

## 🐛 TROUBLESHOOTING

### Issue: "Invalid login credentials"
**Solutions**:
- ✅ Verify email is exactly: `vk8973675@gmail.com`
- ✅ Check password (passwords are case-sensitive)
- ✅ Reset password via Supabase Dashboard
- ✅ Verify user exists in Authentication → Users

### Issue: "Unauthorized: Admin access required"
**Solutions**:
- ✅ Check user has admin role in `user_profiles` table
- ✅ Run: `SELECT * FROM user_profiles WHERE id = 'YOUR-USER-ID';`
- ✅ Verify `role` column = `'admin'` (not `'user'`)
- ✅ If role is wrong, update:
  ```sql
  UPDATE user_profiles 
  SET role = 'admin' 
  WHERE id = 'YOUR-USER-ID';
  ```

### Issue: Redirects to login after successful login
**Solutions**:
- ✅ Check browser console (F12) for errors
- ✅ Verify Supabase credentials in Netlify environment variables
- ✅ Check `user_profiles` table exists and has data
- ✅ Verify RLS policies are enabled

### Issue: Can't access admin routes
**Solutions**:
- ✅ Make sure you're logged in
- ✅ Check auth token in browser (localStorage → supabase.auth.token)
- ✅ Try logging out and logging in again
- ✅ Clear browser cache and cookies

### Issue: "Network error" or "Failed to fetch"
**Solutions**:
- ✅ Verify environment variables in Netlify:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- ✅ Check Supabase project is active
- ✅ Verify API keys are correct
- ✅ Check browser console for CORS errors

---

## 📊 CURRENT DATABASE STATE

### Admin Users:
```sql
SELECT id, email, role, full_name 
FROM user_profiles 
WHERE role = 'admin';
```

**Result**:
| ID | Email | Role | Full Name |
|----|-------|------|-----------|
| 6000eaab-6902-4a6c-9d9b-70087341830e | vk8973675@gmail.com | admin | Vikas Kumar |

### Tables:
- ✅ `blogs` (2 rows)
- ✅ `user_profiles` (1 row)
- ✅ `admin_users` (1 row)

---

## 🔑 RECOMMENDED ADMIN CREDENTIALS

### Primary Admin (Existing):
```
Email: vk8973675@gmail.com
Password: [Reset via Supabase Dashboard]
Recommended New Password: Admin@2024!Secure
```

### Alternative Admin (Create New):
```
Email: admin@myrightwindow.com
Password: Admin@2024!MRW
```

---

## 📝 QUICK SETUP CHECKLIST

For fresh deployment or new admin setup:

- [ ] Verify `user_profiles` table exists in Supabase
- [ ] Admin user exists in Supabase Authentication
- [ ] Admin user has `role = 'admin'` in `user_profiles` table
- [ ] Environment variables set in Netlify:
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_ANON_KEY`
- [ ] Site deployed successfully on Netlify
- [ ] Test login at `/admin/login`
- [ ] Test dashboard access
- [ ] Test CRUD operations (create, edit, delete blogs)

---

## 🎉 YOU'RE ALL SET!

Your admin system is fully functional. Use the credentials above to access your admin dashboard and start managing your blog content.

### Next Steps:
1. Reset password for `vk8973675@gmail.com` (or create new admin)
2. Login at: `https://[your-site].netlify.app/admin/login`
3. Start creating amazing blog posts! 🚀

---

## 📞 NEED HELP?

If you encounter any issues:
1. Check browser console (F12) for errors
2. Verify Supabase credentials in Netlify
3. Check this guide's troubleshooting section
4. Review Supabase logs in dashboard

---

**Last Updated**: November 24, 2025
**System Status**: ✅ Fully Operational
**Admin Count**: 1 active admin user
