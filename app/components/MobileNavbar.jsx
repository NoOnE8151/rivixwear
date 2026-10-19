"use client";

import Link from "next/link";
import { User, ShoppingBag, X } from "lucide-react";
import { motion } from "motion/react";

export default function MobileNavbar({ setIsMobileNavbarOpen }) {
  const handleNavbarClose = () => {
    setIsMobileNavbarOpen(false);
  };

  const menuItems = [
    {
      icon: User,
      label: "Profile",
      href: "/profile",
    },
    {
      icon: ShoppingBag,
      label: "Bag",
      href: "/bag",
    },
    {
      label: "Rivix Essentials",
      href: "#essentials",
    },
    {
      label: "About Us",
      href: "#about",
    },
  ];

  return (
    <motion.div
      className="md:hidden fixed inset-0 z-50"
      initial="closed"
      animate="open"
      exit="closed"
      variants={{
        open: {
          transition: {
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1],
          },
        },
        closed: {
          transition: {
            duration: 0.35,
            ease: [0.4, 0, 1, 1],
          },
        },
      }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/10"
        variants={{
          open: {
            opacity: 1,
          },
          closed: {
            opacity: 0,
          },
        }}
        transition={{
          duration: 0.3,
        }}
        onClick={handleNavbarClose}
      />

      {/* Mobile menu */}
      <motion.div
        className="absolute inset-0 bg-background"
        variants={{
          open: {
            x: 0,
            scale: 1,
          },
          closed: {
            x: "100%",
            scale: 0.98,
          },
        }}
        transition={{
          duration: 0.45,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <nav className="flex flex-col px-6 py-4 h-full">
          {/* Header */}
          <div className="w-full flex justify-between items-center py-3">
            <Link href={'/'}>
            <motion.img
              src="/assets/logo/rivix-wordmark-black.png"
              alt="rivix logo"
              className="w-25"
              variants={{
                open: {
                  opacity: 1,
                  x: 0,
                },
                closed: {
                  opacity: 0,
                  x: -15,
                },
              }}
              transition={{
                duration: 0.3,
                delay: 0.08,
              }}
              />
              </Link>

            <motion.button
              onClick={handleNavbarClose}
              whileTap={{ scale: 0.85, rotate: -10 }}
              className="p-1"
            >
              <X size={34} strokeWidth={1.7} />
            </motion.button>
          </div>

          {/* Menu */}
          <div className="mt-6 flex flex-col">
            {menuItems.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.label}
                  variants={{
                    open: {
                      opacity: 1,
                      x: 0,
                    },
                    closed: {
                      opacity: 0,
                      x: 25,
                    },
                  }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05,
                  }}
                >
                  <Link
                    href={item.href}
                    onClick={handleNavbarClose}
                    className="flex items-center gap-4 py-4 text-left uppercase text-sm tracking-[0.15em]"
                  >
                    {Icon && (
                      <Icon
                        size={19}
                        strokeWidth={1.8}
                      />
                    )}

                    <span>{item.label}</span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </nav>
      </motion.div>
    </motion.div>
  );
}