// app/layout.tsx
'use client';
import { ReactNode } from "react";
import Header from "@/components/Header"; // Переконайтеся, що шлях до вашого Header правильний
import Footer from "@/components/Footer"; // Переконайтеся, що шлях до вашого Footer правильний
import { useState } from "react";
import { Box } from "@mui/material";

export default function RootLayout({ children }: { children: ReactNode }) {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState("");

  const handleLoginClick = () => {
    // Тут має бути логіка вашої автентифікації
    setIsUserLoggedIn(true);
    setProfileImageUrl("/images/user-profile.jpg"); // Приклад URL
    console.log("Кнопку 'Увійти' натиснуто");
  };

  return (
    <html lang="en">
      <body>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header
            onLoginClick={handleLoginClick}
            userProfileUrl={profileImageUrl}
            isLoggedIn={isUserLoggedIn}
          />
          <Box sx={{ flexGrow: 1 }}>{children}</Box> {/* Основний контент займає доступний простір */}
          <Footer />
        </Box>
      </body>
    </html>
  );
}