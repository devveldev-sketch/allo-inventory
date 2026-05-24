import "./globals.css";
import Sidebar from "../components/Sidebar";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen bg-[#140f91] text-white">
          <Sidebar />

          <main className="flex-1 p-10 overflow-y-auto">
            {children}
          </main>

          <Toaster position="top-right" />
        </div>
      </body>
    </html>
  );
}