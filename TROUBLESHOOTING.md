# Troubleshooting Guide

## White Screen Issue - Diagnostic Steps

### What to Check:

1. **Visit the deployed site**: https://swastik-bounty.web.app

2. **What do you see?**
   - A **loading spinner** with blue gradient background and "Loading..." text?
   - A **completely white/blank** page?
   - The **full application** with wallet connect button?

3. **Open Browser Console** (Press F12)
   - Look for any **red error messages**
   - Common errors might be:
     - `Buffer is not defined`
     - `process is not defined`
     - Wallet adapter errors
     - Network/CORS errors

4. **Check Network Tab** (in F12 DevTools)
   - Are all JavaScript files loading successfully?
   - Look for any **404 errors** or **failed requests**

### Common Fixes:

#### If you see JavaScript errors in console:

**Error: `Buffer is not defined`**
Solution: Add to `next.config.mjs`:
```javascript
webpack: (config) => {
  config.resolve.fallback = { 
    ...config.resolve.fallback,
    buffer: require.resolve('buffer/'),
  };
  return config;
}
```

**Error: `process is not defined`**
Solution: Install and configure process polyfill

**Wallet Adapter Errors**
Solution: Ensure Phantom wallet is installed in your browser

#### If the site loads but shows blank:

1. **Clear browser cache** (Ctrl+Shift+Delete)
2. **Hard refresh** the page (Ctrl+F5)
3. **Try incognito/private mode**
4. **Try a different browser**

#### If Firebase hosting cache is stale:

```powershell
# Redeploy to clear cache
cd C:\Users\ACER\Documents\Mini-Hackthon
firebase hosting:channel:deploy test
```

### Quick Test - Create Simple Page

If issues persist, let's create a minimal test page:

```html
<!-- frontend/public/test.html -->
<!DOCTYPE html>
<html>
<head>
    <title>Test Page</title>
</head>
<body>
    <h1>Test Page Works!</h1>
    <p>If you see this, Firebase hosting is working correctly.</p>
</body>
</html>
```

Then visit: https://swastik-bounty.web.app/test.html

### Current Configuration Status:

✅ Static export configured (`output: 'export'`)
✅ ClientOnly wrapper added for SSR/CSR hydration
✅ Metadata export removed
✅ 29 files successfully deployed
✅ Firebase hosting configured correctly

### Next Steps:

1. Visit https://swastik-bounty.web.app
2. Open browser console (F12)
3. Report back:
   - What you see on the page
   - Any errors in the console
   - Screenshot if possible

This will help pinpoint the exact issue!
