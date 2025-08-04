# Secure API Key Setup Guide

## 🚨 **CRITICAL SECURITY FIX**

Your OpenAI API key was exposed in the source code and detected by GitHub's secret scanning. This guide will help you set up secure API key management.

## **IMMEDIATE ACTIONS REQUIRED:**

### 1. **Revoke the Exposed API Key**
- Go to [OpenAI Dashboard](https://platform.openai.com/api-keys)
- Find the exposed key: `sk-proj-x13Fx-HIm6GQ3jyDt6P...`
- Click "Delete" to revoke it immediately
- Generate a new API key

### 2. **Choose a Secure Implementation Method**

## **Option 1: Environment Variables (Recommended)**

### For Development:
1. Create a `.env` file in your project root:
```bash
OPENAI_API_KEY=your_new_api_key_here
```

2. Install and configure environment variable support:
```bash
npm install react-native-dotenv
```

3. Update your `babel.config.js`:
```javascript
module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    ['module:react-native-dotenv', {
      moduleName: '@env',
      path: '.env',
    }],
  ],
};
```

4. Update `SIMPLE_CHECKIN_STORAGE.js`:
```javascript
import { OPENAI_API_KEY } from '@env';

const getOpenAIApiKey = () => {
  return OPENAI_API_KEY;
};
```

### For Production:
- Use your deployment platform's environment variable system
- Never commit `.env` files to version control
- Add `.env` to your `.gitignore` file

## **Option 2: Backend API (Most Secure)**

1. **Create a backend API endpoint** that handles OpenAI requests
2. **Store API key on the server** (never in client code)
3. **Update the app** to call your backend instead of OpenAI directly

Example backend endpoint:
```javascript
// Backend API (Node.js/Express)
app.post('/api/generate-summary', async (req, res) => {
  const { checkInData } = req.body;
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      // ... OpenAI request body
    })
  });
  
  const data = await response.json();
  res.json(data);
});
```

Then update your app to call your backend:
```javascript
// In SIMPLE_CHECKIN_STORAGE.js
const response = await fetch('https://your-backend.com/api/generate-summary', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ checkInData: checkIn })
});
```

## **Option 3: Secure Storage (Temporary Solution)**

For a quick fix while implementing proper security:

```javascript
// Store API key in AsyncStorage (NOT recommended for production)
import AsyncStorage from '@react-native-async-storage/async-storage';

const getOpenAIApiKey = async () => {
  try {
    return await AsyncStorage.getItem('OPENAI_API_KEY');
  } catch (error) {
    console.error('Error getting API key:', error);
    return null;
  }
};
```

## **Security Best Practices:**

### ✅ **DO:**
- Use environment variables
- Store API keys on backend servers
- Use secure storage solutions
- Rotate API keys regularly
- Monitor API usage for unusual activity

### ❌ **DON'T:**
- Hardcode API keys in source code
- Commit API keys to version control
- Store API keys in client-side code
- Share API keys in public repositories
- Use the same API key across multiple projects

## **GitHub Security Settings:**

1. **Enable Secret Scanning** (already enabled)
2. **Set up branch protection rules**
3. **Use pre-commit hooks** to prevent API key commits
4. **Regular security audits**

## **Monitoring:**

- Check your OpenAI usage dashboard regularly
- Set up billing alerts
- Monitor for unusual API usage patterns

## **Next Steps:**

1. **Immediately revoke the exposed API key**
2. **Choose and implement one of the secure options above**
3. **Test the new implementation**
4. **Update your deployment process**
5. **Document the security setup for your team**

## **Emergency Contact:**

If you suspect your API key has been compromised:
- Revoke the key immediately
- Check your OpenAI usage for unauthorized charges
- Contact OpenAI support if needed
- Review your codebase for other exposed secrets

---

**Remember: Security is not optional. Always treat API keys as sensitive credentials and never expose them in client-side code.** 