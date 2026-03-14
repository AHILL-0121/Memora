"use client";

import Link from 'next/link';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

const links = [
  { href: '/#how', label: 'How it Works' },
  { href: '/#features', label: 'Features' },
  { href: '/#use-cases', label: 'Use Cases' }
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-[#f0e5d8] bg-[rgba(253,250,245,0.95)] backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="text-2xl font-semibold tracking-tight">
          Memo<span className="text-[#E8734A]">ra</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-[#8c7355] md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-[#D44A2A]">
              {link.label}
            </Link>
          ))}
          <SignedOut>
            <SignInButton mode="modal">
              <button type="button" className="btn-primary px-4 py-2 text-xs">Sign In</button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link href="/cards/new" className="btn-primary px-4 py-2 text-xs">Start Creating</Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </nav>
      </div>
    </header>
  );
}
