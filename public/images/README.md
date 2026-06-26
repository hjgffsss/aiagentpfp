# Brand Assets

These PNG files are the project's visual identity, generated to match the
Crypto Agent brand (blue/purple/cyan gradient hex-node mark, dark
background). Replace them with your final branding any time — same
filenames, drop-in replacement.

| File | Used for | Recommended replacement specs |
|------|----------|----------------------------------|
| `logo.png` | Navbar logo, About section emblem, Footer, Admin login, WalletConnect metadata icon | PNG, square, transparent or dark background, 512×512 |
| `favicon.png` | Browser tab icon (`app/layout.tsx` → `metadata.icons`) | PNG or `.ico`, 128×128 (or provide multiple sizes) |
| `bot-avatar.png` | Whitelist Assistant chat avatar | PNG, square, 256×256 |
| `og-banner.png` | Social share preview (Open Graph + Twitter Card) | PNG or JPG, 1200×630 |
| `nft/agent-0001.png` … `agent-0008.png` | Collection section preview cards | PNG, square, 600×600+ — replace with real generative art renders once available |

To swap an asset: replace the file with the same filename, or update the
path in the relevant component (`app/layout.tsx` for favicon/OG, individual
component files for everything else — search for `/images/` to find every
reference).
