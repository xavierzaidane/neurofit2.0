"use client";

import {
  SignInButton,
  SignOutButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { Menu, X, ZapIcon } from "lucide-react";
import Link from "next/link";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isSignedIn } = useUser();
  const { scrollY } = useScroll();

  const backgroundColor = useTransform(
    scrollY,
    [0, 50],
    ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.8)"]
  );
  const backdropFilter = useTransform(scrollY, [0, 50], ["blur(0px)", "blur(12px)"]);
  const borderColor = useTransform(
    scrollY,
    [0, 50],
    ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.1)"]
  );
  const paddingBlock = useTransform(scrollY, [0, 50], ["24px", "16px"]);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          backgroundColor,
          backdropFilter,
          borderBottomColor: borderColor,
          borderBottomWidth: 1,
          borderBottomStyle: "solid",
          paddingTop: paddingBlock,
          paddingBottom: paddingBlock,
        }}
        className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 flex justify-between items-center"
      >
        <Link href="/" className="font-display text-2xl font-bold tracking-tighter uppercase text-white z-50">
          <span>Neurofit</span><span className="text-xs font-mono font-normal text-muted-foreground">2.0</span>
        </Link>

        <div className="hidden md:flex gap-8 items-center">
          {isSignedIn ? (
            <>
              <Link href="/" className="text-sm text-white/70 hover:text-white transition-colors">
                Home
              </Link>
              <Link
                href="/program"
                className="text-sm text-white/70 hover:text-white transition-colors"
              >
                Generate
              </Link>
              <Link href="/neurobot" className="text-sm text-white/70 hover:text-white transition-colors">
                Neurobot
              </Link>
              <Link href="/profile" className="text-sm text-white/70 hover:text-white transition-colors">
                Profile
              </Link>
              
            </>
          ) : (
            <>
              <Link href="#features" className="text-sm text-white/70 hover:text-white transition-colors">
                Features
              </Link>
              <Link href="#about" className="text-sm text-white/70 hover:text-white transition-colors">
                About
              </Link>
              <Link href="#pricing" className="text-sm text-white/70 hover:text-white transition-colors">
                Pricing
              </Link>
            </>
          )}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {isSignedIn ? (
            <>
              <SignOutButton>
                <button className="border border-white/30 text-white px-6 py-2 rounded-full font-medium text-sm hover:border-white/20 hover:text-foreground/50 transition-all duration-300">
                  Sign Out
                </button>
              </SignOutButton>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-9 w-9 ring-2 ring-foreground/50",
                  },
                }}
              />
            </>
          ) : (
            <>
              <SignInButton 
              mode="modal">
                <button className="border border-white/30 text-white px-6 py-2 rounded-full font-medium text-sm hover:border-white/20 hover:text-foreground/50 transition-all duration-300">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="bg-foreground text-black px-6 py-2 rounded-full font-bold text-sm hover:bg-white hover:text-black transition-all duration-300 ">
                  Get Access
                </button>
              </SignUpButton>
            </>
          )}
        </div>

        <button className="md:hidden text-white z-50" onClick={() => setIsOpen((prev) => !prev)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </motion.header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-black pt-24 px-6 md:hidden flex flex-col gap-8"
          >
            <div className="flex flex-col gap-6 text-2xl font-display font-bold">
              {isSignedIn ? (
                <>
                  <Link href="/" onClick={() => setIsOpen(false)} className="text-white/70 hover:text-foreground transition-colors">
                    Home
                  </Link>
                  <Link
                    href="/program"
                    onClick={() => setIsOpen(false)}
                    className="text-white/70 hover:text-foreground transition-colors"
                  >
                    Generate
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setIsOpen(false)}
                    className="text-white/70 hover:text-foreground transition-colors"
                  >
                    Profile
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="#features"
                    onClick={() => setIsOpen(false)}
                    className="text-white/70 hover:text-foreground transition-colors"
                  >
                    Features
                  </Link>
                  <Link
                    href="#about"
                    onClick={() => setIsOpen(false)}
                    className="text-white/70 hover:text-foreground transition-colors"
                  >
                    About
                  </Link>
                  <Link
                    href="#pricing"
                    onClick={() => setIsOpen(false)}
                    className="text-white/70 hover:text-foreground transition-colors"
                  >
                    Pricing
                  </Link>
                </>
              )}
            </div>

            <div className="mt-auto pb-10 flex flex-col gap-4">
              {isSignedIn ? (
                <>
                  <SignOutButton>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="w-full border border-white/30 text-white py-4 rounded-full font-bold text-lg hover:border-foreground hover:text-foreground/50 transition-all duration-300"
                    >
                      Sign Out
                    </button>
                  </SignOutButton>
                  <div className="flex justify-center">
                    <UserButton
                      appearance={{
                        elements: {
                          avatarBox: "h-11 w-11 ring-2 ring-foreground/50",
                        },
                      }}
                    />
                  </div>
                </>
              ) : (
                <>
                  <SignInButton mode="modal">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="w-full border border-white/30 text-white py-4 rounded-full font-bold text-lg hover:border-foreground hover:text-foreground/50 transition-all duration-300"
                    >
                      Sign In
                    </button>
                  </SignInButton>

                  <SignUpButton mode="modal">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="w-full bg-foreground text-black py-4 rounded-full font-bold text-lg hover:bg-white hover:text-black transition-all duration-300 shadow-[0_0_20px_rgba(249,115,22,0.4)]"
                    >
                      Get Access
                    </button>
                  </SignUpButton>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
export default Navbar;