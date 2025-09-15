import "./globals.css";

export const metadata = {
  title: "USATether · USA₮",
  description: "Demo landing with calculator",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
