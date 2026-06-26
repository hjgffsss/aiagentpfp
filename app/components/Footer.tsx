import Image from "next/image";
import { Twitter, MessageCircle, Github, FileText } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative border-t border-edge py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
          <div>
            <div className="flex items-center gap-2.5">
              <Image src="/images/logo.png" alt="Crypto Agent" width={28} height={28} />
              <span className="font-display font-semibold text-text-primary">
                Crypto Agent
              </span>
            </div>
            <p className="mt-3 text-sm text-text-muted max-w-xs">
              Built for the future of onchain intelligence.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-text-secondary">
            <a href="#" className="hover:text-text-primary flex items-center gap-1.5">
              <Twitter size={14} /> X
            </a>
            <a href="#" className="hover:text-text-primary flex items-center gap-1.5">
              <MessageCircle size={14} /> Discord
            </a>
            <a href="#" className="hover:text-text-primary flex items-center gap-1.5">
              <Github size={14} /> GitHub
            </a>
            <a href="#" className="hover:text-text-primary flex items-center gap-1.5">
              <FileText size={14} /> Docs
            </a>
            <a href="#" className="hover:text-text-primary">Terms</a>
            <a href="#" className="hover:text-text-primary">Privacy</a>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-edge text-xs text-text-muted text-center sm:text-left">
          © 2026 Crypto Agent. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
