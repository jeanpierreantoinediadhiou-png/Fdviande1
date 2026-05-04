import { useState } from "react";
import { Navbar } from "@/components/storefront/Navbar";
import { Hero } from "@/components/storefront/Hero";
import { Catalog } from "@/components/storefront/Catalog";
import { Story } from "@/components/storefront/Story";
import { Footer } from "@/components/storefront/Footer";
import { CartDrawer } from "@/components/storefront/CartDrawer";

const Index = () => {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar onCartOpen={() => setCartOpen(true)} />
      <main className="flex-1">
        <Hero />
        <Catalog />
        <Story />
      </main>
      <Footer />
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </div>
  );
};

export default Index;
