import "./globals.css";

export const metadata = {
  title: "EventShield",
  description: "Protection layer for events, workshops & activities"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0d0d0d] text-white">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <header className="mb-10">
            <h1 className="text-3xl font-bold">EventShield</h1>
            <p className="text-gray-400 text-sm">
              Event Protection Layer for Workshops, Activities & Experiences
            </p>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}

