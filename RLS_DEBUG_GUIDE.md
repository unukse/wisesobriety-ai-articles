# RLS Debug Guide - Check-in Creation Issue

## 🔍 **DEBUGGING: Enhanced Error Detection Applied**

### **🛠️ Enhanced Debug Features Added:**

#### **1. Detailed Check-in Creation Logging (supabase.js)**
**Added comprehensive logging for check-in creation:**
```javascript
console.log('About to insert check-in record:', checkInRecord);
let { data, error } = await supabase.from('check_ins').insert(checkInRecord).select().single();
console.log('Check-in insert result:', { data, error });

if (error) {
  console.error('Error details:', {
    code: error.code,
    message: error.message,
    details: error.details,
    hint: error.hint
  });
}
```

#### **2. RLS Policy Testing Function**
**Added comprehensive RLS test function:**
```javascript
testRLSPolicies: async () => {
  // Test select operations
  // Test insert operations
  // Test with current user
  // Clean up test data
}
```

#### **3. RLS Test Button (CheckInScreen.js)**
**Added RLS test function to CheckInScreen:**
```javascript
const testRLSPolicies = async () => {
  const result = await checkIns.testRLSPolicies();
  // Show results to user
}
```

### **🎯 What to Test:**

#### **Step 1: Test RLS Policies**
1. **Add a test button** to trigger RLS test
2. **Run the test** to see if RLS policies are working
3. **Check console logs** for detailed RLS test results

#### **Step 2: Test Check-in Creation**
1. **Submit a check-in** and watch for detailed logs
2. **Look for these logs:**
   - `About to insert check-in record:`
   - `Check-in insert result:`
   - `Error details:` (if there's an error)

#### **Step 3: Analyze Results**
**If RLS test fails:**
- RLS policies need to be fixed
- User might not have proper permissions

**If check-in creation fails:**
- Look at error details (code, message, details, hint)
- Check if it's an authentication issue
- Check if it's a database schema issue

### **📋 Expected Debug Output:**

**Successful check-in creation:**
```
About to insert check-in record: {user_id: "...", emotional_state: "...", ...}
Check-in insert result: {data: {id: "...", ...}, error: null}
```

**Failed check-in creation:**
```
About to insert check-in record: {user_id: "...", emotional_state: "...", ...}
Check-in insert result: {data: null, error: {...}}
Error details: {code: "42501", message: "row-level security policy violation", ...}
```

### **🚨 Common Issues:**

| Issue | Error Code | Solution |
|-------|------------|----------|
| RLS Policy Violation | 42501 | Fix RLS policies |
| Authentication Error | 401 | Refresh session |
| Schema Error | 42703 | Fix database schema |
| Permission Error | 42501 | Check user permissions |

### **🔧 Next Steps:**

1. **Add a test button** to trigger RLS test
2. **Run RLS test** to check policy status
3. **Submit a check-in** and watch detailed logs
4. **Share debug output** to identify exact issue

**The enhanced debugging will reveal exactly what's causing the check-in creation to fail!** 🔍 