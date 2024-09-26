import "./globals.css";

export const metadata = {
  title: "Taylor Typing Test",
  description: "The Taylor Swift themed typing test",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
