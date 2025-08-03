# 🚀 API Setup Guide for AI Summary Generation

## **Why Use API Instead of Edge Functions?**

✅ **Simpler setup** - No complex deployment issues  
✅ **Better error handling** - Direct API calls with detailed logging  
✅ **Easier debugging** - Standard HTTP requests and responses  
✅ **More reliable** - No Edge Function deployment complications  
✅ **Better control** - Direct access to OpenAI API  

## **🔧 Setup Options**

### **Option 1: Direct OpenAI API (Recommended)**

1. **Get OpenAI API Key**
   - Go to [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create a new API key
   - Copy the key

2. **Update the API Key**
   - Open `src/lib/ai-summary-api.js`
   - Replace `'your-openai-api-key'` with your actual API key
   - **⚠️ SECURITY WARNING**: In production, use environment variables!

3. **Update CheckInScreen**
   - Import the new API module
   - Replace Edge Function calls with API calls

### **Option 2: Simple Express.js API Server**

1. **Create API Server**
   ```bash
   mkdir ai-summary-api
   cd ai-summary-api
   npm init -y
   npm install express cors dotenv openai
   ```

2. **Create `server.js`**
   ```javascript
   const express = require('express');
   const cors = require('cors');
   require('dotenv').config();
   const OpenAI = require('openai');

   const app = express();
   const port = 3001;

   app.use(cors());
   app.use(express.json());

   const openai = new OpenAI({
     apiKey: process.env.OPENAI_API_KEY,
   });

   app.post('/api/generate-summary', async (req, res) => {
     try {
       const { checkInData } = req.body;
       
       const prompt = createSummaryPrompt(checkInData);
       
       const completion = await openai.chat.completions.create({
         model: 'gpt-3.5-turbo',
         messages: [
           {
             role: 'system',
             content: 'You are a compassionate AI assistant supporting people in recovery from alcohol addiction.'
           },
           {
             role: 'user',
             content: prompt
           }
         ],
         max_tokens: 300,
         temperature: 0.7,
       });

       const summary = completion.choices[0].message.content;
       
       res.json({ success: true, summary });
     } catch (error) {
       console.error('API Error:', error);
       res.status(500).json({ success: false, error: error.message });
     }
   });

   function createSummaryPrompt(checkIn) {
     const date = new Date(checkIn.created_at).toLocaleDateString();
     
     return `As a supportive AI assistant for someone in recovery from alcohol addiction, please provide a compassionate and insightful summary of this daily check-in from ${date}.

Check-in Details:
- Emotional State: "${checkIn.emotional_state}"
- Alcohol Consumption: "${checkIn.alcohol_consumption}"
- Craving Triggers: ${checkIn.craving_triggers.length > 0 ? checkIn.craving_triggers.join(', ') : 'None reported'}
- Coping Strategies Used: ${checkIn.coping_strategies.length > 0 ? checkIn.coping_strategies.join(', ') : 'None reported'}
- What They're Proud Of: "${checkIn.proud_of}"
- Motivation Level: ${checkIn.motivation_rating}/10
- Support Needed: "${checkIn.support_need}"

Please provide a 2-3 paragraph summary that:
1. Acknowledges their emotional state and progress
2. Highlights positive coping strategies and achievements
3. Offers gentle encouragement and support
4. Suggests actionable next steps based on their needs
5. Maintains a warm, supportive tone throughout

Keep the summary under 200 words and focus on being encouraging and helpful.`;
   }

   app.listen(port, () => {
     console.log(`AI Summary API running on port ${port}`);
   });
   ```

3. **Create `.env` file**
   ```
   OPENAI_API_KEY=your-openai-api-key-here
   ```

4. **Start the server**
   ```bash
   node server.js
   ```

### **Option 3: Vercel/Netlify API Function**

1. **Create API folder structure**
   ```
   api/
   └── generate-summary.js
   ```

2. **Create `api/generate-summary.js`**
   ```javascript
   import OpenAI from 'openai';

   const openai = new OpenAI({
     apiKey: process.env.OPENAI_API_KEY,
   });

   export default async function handler(req, res) {
     if (req.method !== 'POST') {
       return res.status(405).json({ error: 'Method not allowed' });
     }

     try {
       const { checkInData } = req.body;
       
       const prompt = createSummaryPrompt(checkInData);
       
       const completion = await openai.chat.completions.create({
         model: 'gpt-3.5-turbo',
         messages: [
           {
             role: 'system',
             content: 'You are a compassionate AI assistant supporting people in recovery from alcohol addiction.'
           },
           {
             role: 'user',
             content: prompt
           }
         ],
         max_tokens: 300,
         temperature: 0.7,
       });

       const summary = completion.choices[0].message.content;
       
       res.json({ success: true, summary });
     } catch (error) {
       console.error('API Error:', error);
       res.status(500).json({ success: false, error: error.message });
     }
   }

   function createSummaryPrompt(checkIn) {
     // ... same prompt function as above
   }
   ```

## **🔄 Update Your App**

### **Step 1: Update CheckInScreen**

Replace the Edge Function import with the API version:

```javascript
// Replace this:
import { aiSummary } from '../lib/ai-summary';

// With this:
import { aiSummaryAPI } from '../lib/ai-summary-api';
```

### **Step 2: Update Function Calls**

Replace Edge Function calls with API calls:

```javascript
// Replace this:
const { success: summarySuccess, data: summaryData, error: summaryError } = 
  await aiSummary.generateSummary(data.id, userIdForSummary);

// With this:
const { success: summarySuccess, data: summaryData, error: summaryError } = 
  await aiSummaryAPI.generateSummary(data.id, userIdForSummary);
```

## **✅ Benefits of API Approach**

1. **No Edge Function Deployment Issues**
2. **Direct Error Messages**
3. **Easier Debugging**
4. **Better Performance**
5. **More Control Over API Keys**

## **🔒 Security Considerations**

- **Never expose API keys** in client-side code
- **Use environment variables** for API keys
- **Implement proper authentication** for production
- **Consider rate limiting** for API endpoints

## **🎯 Quick Start**

1. **Choose Option 1** (Direct OpenAI API) for simplicity
2. **Update your API key** in `ai-summary-api.js`
3. **Update CheckInScreen** to use the new API
4. **Test the functionality**

**The API approach is much more reliable than Edge Functions!** 🚀 