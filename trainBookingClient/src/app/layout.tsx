// app/layout.tsx
'use client';
import { ReactNode, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Box } from "@mui/material";
import { UserContextProvider } from "@/components/UserContext";

export default function RootLayout({ children }: { children: ReactNode }) {
  const [profileImageUrl, setProfileImageUrl] = useState("");

  return (
    <html lang="en">
      <body>
        <UserContextProvider>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header userProfileUrl={profileImageUrl} /> {/* Більше не передаємо isLoggedIn та fullName */}
            <Box sx={{ flexGrow: 1 }}>{children}</Box>
            <Footer />
          </Box>
        </UserContextProvider>
      </body>
    </html>
  );
}