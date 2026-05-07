import React from 'react';
import { motion } from 'framer-motion';
import { Facebook, Loader2 } from 'lucide-react';
import { loadFacebookSDK } from '../../../services/facebookSDK';

interface MetaSignupButtonProps {
  onSuccess: (code: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export default function MetaSignupButton({ onSuccess, isLoading, disabled }: MetaSignupButtonProps) {
  const handleLogin = async () => {
    try {
      await loadFacebookSDK();
      
      window.FB.login((response: any) => {
        if (response.authResponse) {
          const code = response.authResponse.code;
          if (code) {
            onSuccess(code);
          }
        } else {
          console.log('User cancelled login or did not fully authorize.');
        }
      }, {
        config_id: '25072021329136917', 
        response_type: 'code',
        override_default_response_type: true,
        scope: 'whatsapp_business_management,whatsapp_business_messaging',
        extras: {
          feature: 'whatsapp_embedded_signup',
          sessionInfoVersion: 2
        }
      });
    } catch (error) {
      console.error('Failed to initialize Meta Signup', error);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleLogin}
      disabled={isLoading || disabled}
      className="flex items-center justify-center gap-3 w-full py-4 px-6 bg-[#0668E1] hover:bg-[#0559C1] text-white rounded-2xl font-bold transition-all shadow-xl shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed text-base"
    >
      {isLoading ? (
        <Loader2 className="animate-spin" size={20} />
      ) : (
        <Facebook size={20} fill="currentColor" />
      )}
      <span>{isLoading ? 'Processing Registration...' : 'Connect with Facebook'}</span>
    </motion.button>
  );
}
