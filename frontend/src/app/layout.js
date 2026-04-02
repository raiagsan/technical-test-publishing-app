import "./globals.css";
import { AuthProvider } from "@/context/authContext";

export const metadata = {
  title: "Book Catalog",
  description: "Digital platform for managing Books, Authors, and Publishers",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
