function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a 
      href={href} 
      className="text-[14px] text-graytext font-medium transition-all duration-100 hover:text-[var(--link-hover)]"
    >
      {children}
    </a>
  );
}

export default function BotBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-8">
      <div className="mx-auto flex w-full items-center justify-between">
        <p className="text-[14px] text-graytext font-medium">
          &copy; {new Date().getFullYear()} Beavery Space.
        </p>
        <div className="flex items-center gap-8">
          <FooterLink href="/terms">Terms</FooterLink>
          <FooterLink href="/privacy">Privacy</FooterLink>
          <FooterLink href="/contact">Contact</FooterLink>
        </div>
      </div>
    </div>
  );
}

