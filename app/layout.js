import { JetBrains_Mono, Inter, Space_Grotesk } from "next/font/google";
import "./globals.scss";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-title",
  display: "swap",
});

export const metadata = {
  title: "Pathfinder \u2014 Graph Algorithm Visualizer",
  description:
    "Watch BFS, DFS, Dijkstra, and A* explore a grid step by step, and compare how each one finds a path.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} ${inter.variable} ${spaceGrotesk.variable}`}>
      <body>{children}</body>
    </html>
  );
}

