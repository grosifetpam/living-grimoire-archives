import { useState } from "react";
import Navbar from "./Navbar";
import GoldenParticles from "./GoldenParticles";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/bg-multivers.png')" }}
      />
      <div className="fixed inset-0 z-0 bg-background/85" />
      
      <GoldenParticles />
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <main className="relative z-20 pt-16">
        {children}
      </main>
    </div>
  );
};

export default Layout;
