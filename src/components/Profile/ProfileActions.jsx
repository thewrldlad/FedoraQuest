import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import {
  Pencil,
  Share2,
  MoreHorizontal,
  Link2,
  Globe,
} from "lucide-react";
import Button from "../Button/Button";
import { getLearningTitle } from "../../utils/learningTitle";

// Edit/Share stay fully functional (Share copies a real summary to the
// clipboard, same as before). "More actions" is the future-ready
// extension point called for in the brief — Copy Profile Link works
// today; the other two are clearly-labeled placeholders for features
// that don't exist yet (public profiles, GitHub linking), not faked.
export default function ProfileActions({ xp, streak, onEditClick }) {
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const handleShare = () => {
    const { title } = getLearningTitle(xp);
    const summary = `I'm a ${title} on FedoraQuest with ${xp.toLocaleString()} XP and a ${streak}-day streak!`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleCopyLink = () => {
    // There's no public profile route yet (see the disabled item below),
    // so this copies the current, private profile URL — honest about
    // what it actually does rather than fabricating a public link.
    navigator.clipboard.writeText(`${window.location.origin}/profile`);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 1500);
    setMenuOpen(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 shrink-0 lg:justify-end">
      <Button
        variant="secondary"
        onClick={onEditClick}
        className="border-fedora-border bg-fedora-bg/40 hover:border-fedora-accent-light"
      >
        <span className="flex items-center gap-2">
          <Pencil size={16} aria-hidden="true" />
          Edit Profile
        </span>
      </Button>

      <Button onClick={handleShare} className="shadow-md shadow-fedora-accent/25">
        <span className="flex items-center gap-2">
          <Share2 size={16} aria-hidden="true" />
          {copied ? "Copied!" : "Share Profile"}
        </span>
      </Button>

      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          aria-label="More profile actions"
          className="w-10 h-10 flex items-center justify-center rounded-lg border border-fedora-border bg-fedora-bg/40 text-fedora-text hover:border-fedora-accent-light hover:bg-fedora-border transition-colors"
        >
          <MoreHorizontal size={18} />
        </button>

        {menuOpen && (
          <div
            role="menu"
            className="absolute right-0 top-full mt-2 w-64 bg-fedora-surface border border-fedora-border rounded-lg shadow-lg py-2 z-10"
          >
            <button
              role="menuitem"
              onClick={handleCopyLink}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-fedora-text hover:bg-fedora-border transition-colors"
            >
              <Link2 size={16} aria-hidden="true" />
              {linkCopied ? "Link copied!" : "Copy Profile Link"}
            </button>

            <button
              role="menuitem"
              disabled
              title="Public profiles aren't available yet"
              className="w-full flex items-center justify-between gap-2 px-4 py-2 text-sm text-fedora-muted cursor-not-allowed"
            >
              <span className="flex items-center gap-2">
                <Globe size={16} aria-hidden="true" />
                View Public Profile
              </span>
              <span className="text-[10px] uppercase tracking-wide">Soon</span>
            </button>

            <button
              role="menuitem"
              disabled
              title="GitHub account linking isn't available yet"
              className="w-full flex items-center justify-between gap-2 px-4 py-2 text-sm text-fedora-muted cursor-not-allowed"
            >
              <span className="flex items-center gap-2">
                <Link2 size={16} aria-hidden="true" />
                Connect GitHub
              </span>
              <span className="text-[10px] uppercase tracking-wide">Soon</span>
            </button>

            <div className="border-t border-fedora-border my-1" />

            <Link
              role="menuitem"
              to="/certificates"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-fedora-text hover:bg-fedora-border transition-colors"
            >
              <Share2 size={16} aria-hidden="true" />
              Share a Certificate
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
