// components/StripeWrapper.tsx
import React from "react";
import { StripeProvider } from "@stripe/stripe-react-native";

export default function StripeWrapper({ children }: { children: React.ReactElement | React.ReactElement[] }) {
  return (
    <StripeProvider
      publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!}
      merchantIdentifier="merchant.identifier"
      urlScheme="your-url-scheme"
    >
      {children}
    </StripeProvider>
  );
}
