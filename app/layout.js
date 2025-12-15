import "./globals.css";

export const metadata = {
  title: "Ozodbek Abdullayev — Full Stack Developer",
  description: "Portfolio of Ozodbek Abdullayev. Full Stack Developer & Product Builder.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
