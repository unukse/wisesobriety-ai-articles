# GitHub Pages Setup for Email Confirmation

## Step-by-Step Guide

### Step 1: Create a New GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Name it something like `wisesobriety-email-confirmation`
5. Make it **Public** (required for free GitHub Pages)
6. Don't initialize with README (we'll add files manually)
7. Click "Create repository"

### Step 2: Upload the HTML File

#### Option A: Using GitHub Web Interface
1. In your new repository, click "Add file" → "Create new file"
2. Name it `index.html` (this will be your main page)
3. Copy and paste the entire content from `email-confirmed.html`
4. Click "Commit new file"

#### Option B: Using Git (if you have Git installed)
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/wisesobriety-email-confirmation.git
cd wisesobriety-email-confirmation

# Copy the HTML file
cp ../email-confirmed.html index.html

# Add and commit
git add index.html
git commit -m "Add email confirmation page"
git push origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click "Settings" tab
3. Scroll down to "Pages" section (in the left sidebar)
4. Under "Source", select "Deploy from a branch"
5. Under "Branch", select "main" and click "Save"
6. Wait a few minutes for the page to deploy

### Step 4: Get Your GitHub Pages URL

Your page will be available at:
```
https://YOUR_USERNAME.github.io/wisesobriety-email-confirmation/
```

For example, if your GitHub username is `johnsmith`, the URL would be:
```
https://johnsmith.github.io/wisesobriety-email-confirmation/
```

### Step 5: Update Your App Configuration

Update the `emailRedirectTo` URL in your `src/contexts/AuthContext.js`:

```javascript
const signUp = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: 'https://YOUR_USERNAME.github.io/wisesobriety-email-confirmation/',
        data: {
          email_confirmed: false
        }
      }
    });
    // ... rest of the function
  } catch (error) {
    // ... error handling
  }
};
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Testing Your Setup

### 1. Test the GitHub Pages URL
1. Open your GitHub Pages URL in a browser
2. You should see the beautiful confirmation page
3. Test the "Open Wise Sobriety App" button (it should try to open your app)

### 2. Test the Complete Flow
1. Sign up in your app with a test email
2. Check your email for the confirmation link
3. Click the link - it should open your GitHub Pages confirmation page
4. Click "Open Wise Sobriety App" - it should open your app

## Customization Options

### Update the Page Content
You can edit the HTML file directly on GitHub:
1. Go to your repository
2. Click on `index.html`
3. Click the pencil icon to edit
4. Make your changes
5. Click "Commit changes"

### Add Your Logo
To add your app logo:
1. Upload your logo image to the repository
2. Update the HTML to include the logo:

```html
<div class="logo">
  <img src="your-logo.png" alt="Wise Sobriety" style="width: 120px; height: auto;">
</div>
```

### Change Colors
Update the CSS variables in the `<style>` section:
```css
body {
  background: linear-gradient(135deg, #YOUR_COLOR1 0%, #YOUR_COLOR2 100%);
}
```

## Troubleshooting

### Issue: Page shows 404 error
**Solution:**
- Make sure the repository is **public**
- Check that GitHub Pages is enabled in Settings
- Wait a few minutes for deployment (can take up to 10 minutes)

### Issue: Page loads but looks broken
**Solution:**
- Check that the HTML file is named `index.html`
- Verify all CSS is included in the `<style>` section
- Test on different browsers

### Issue: App doesn't open when clicking button
**Solution:**
- Test the deep link manually: `wisesobriety://auth`
- Ensure your app is installed on the device
- Check that your app's URL scheme is properly configured

### Issue: Email confirmation link doesn't work
**Solution:**
- Verify the GitHub Pages URL is correct
- Check that the URL is accessible in a browser
- Update the `emailRedirectTo` URL in your app

## Benefits of GitHub Pages

✅ **Free hosting** - no cost involved  
✅ **Automatic HTTPS** - secure by default  
✅ **Fast and reliable** - served by GitHub's CDN  
✅ **Easy to update** - just edit the file on GitHub  
✅ **Version control** - track all changes  
✅ **Custom domain support** - can use your own domain later  

## Next Steps

1. **Test the complete flow** from signup to confirmation
2. **Customize the page** to match your brand
3. **Add your logo** and update colors if needed
4. **Deploy your app** and test with real users
5. **Monitor the confirmation page** for any issues

Your email confirmation flow is now ready with GitHub Pages hosting! 🎉 