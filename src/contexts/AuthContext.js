import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if Supabase is properly configured
    const checkSupabaseConfig = async () => {
      try {
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Supabase configuration error:', error);
          // If there's a configuration error, we'll still set loading to false
          // but the user won't be able to authenticate
        }
        
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Failed to initialize Supabase:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSupabaseConfig();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email, password, name) => {
    try {
      // Create the user account in Supabase with email confirmation enabled
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: 'https://unukse.github.io/wisesobriety-confirmation/index.html',
          data: {
            email_confirmed: false,
            name: name
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { 
        success: true, 
        data,
        message: 'Account created successfully. Please check your email to confirm your account.'
      };
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: 'Failed to create account. Please check your configuration.' };
    }
  };

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: 'Failed to sign in. Please check your configuration.' };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
      }
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const resetPassword = async (email) => {
    try {
      // Use Supabase's built-in password reset with deep link redirect
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'wisesobriety://reset-password'
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, error: 'Failed to send reset email' };
    }
  };

  // New functions for in-app password reset flow
  const requestPasswordReset = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: null // Don't redirect, just send email
      });
      
      if (error) {
        throw error;
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const verifyResetCode = async (email, code) => {
    try {
      // For now, we'll simulate code verification
      // In a real implementation, you'd validate the code against Supabase
      // This is a placeholder - you can implement actual code validation later
      if (code && code.length === 6) {
        return { success: true };
      } else {
        return { success: false, error: 'Invalid code' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updatePasswordWithCode = async (email, code, newPassword) => {
    try {
      // For now, we'll simulate password update
      // In a real implementation, you'd use Supabase's updateUser with the validated code
      // This is a placeholder - you can implement actual password update later
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const confirmEmail = async (token, email) => {
    try {
      // For Supabase's built-in email confirmation, the confirmation is handled automatically
      // when the user clicks the link. We just need to update the user's status.
      const { error } = await supabase.auth.updateUser({
        data: { email_confirmed: true }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Email confirmation error:', error);
      return { success: false, error: 'Failed to confirm email' };
    }
  };

  const refreshAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    } catch (error) {
      console.error('Failed to refresh auth:', error);
    }
  };

  // Simple reset password without code validation
  const simpleResetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://unukse.github.io/wisesobriety-confirmation/reset-password.html'
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, error: 'Failed to send reset email' };
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    requestPasswordReset,
    verifyResetCode,
    updatePasswordWithCode,
    confirmEmail,
    refreshAuth,
    simpleResetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 