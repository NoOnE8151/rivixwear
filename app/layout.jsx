// app/layout.js
import "./globals.css";
import "./custom css/authentication.css"
import "./custom css/utility animations.css"
import { bebas, montserrat } from "./fonts/index";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata = {
  title: "RIVIX — Define Your Direction",
  description:
    "Premium oversized streetwear built for those who move with intention. Crafted from 380gsm heavyweight cotton.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" className="scroll-smooth">
        <head></head>
        <body className={`${bebas.variable} ${montserrat.variable}`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
