// Generates a shareable PNG banner client-side using Canvas, so each user's
// share image can include their own handle without needing a server-side
// image rendering pipeline. Returns a data URL.

export async function generateShareBanner(xUsername: string): Promise<string> {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 630;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  // Background
  const bgGrad = ctx.createLinearGradient(0, 0, 1200, 630);
  bgGrad.addColorStop(0, "#05060A");
  bgGrad.addColorStop(1, "#0D0F1A");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1200, 630);

  // Glow accents
  const glow1 = ctx.createRadialGradient(1000, 120, 0, 1000, 120, 260);
  glow1.addColorStop(0, "rgba(139,92,246,0.25)");
  glow1.addColorStop(1, "rgba(139,92,246,0)");
  ctx.fillStyle = glow1;
  ctx.fillRect(0, 0, 1200, 630);

  const glow2 = ctx.createRadialGradient(120, 560, 0, 120, 560, 220);
  glow2.addColorStop(0, "rgba(34,211,238,0.18)");
  glow2.addColorStop(1, "rgba(34,211,238,0)");
  ctx.fillStyle = glow2;
  ctx.fillRect(0, 0, 1200, 630);

  // Logo mark (simple hexagon node, matches brand mark)
  const accentGrad = ctx.createLinearGradient(80, 80, 144, 144);
  accentGrad.addColorStop(0, "#3B82F6");
  accentGrad.addColorStop(0.5, "#8B5CF6");
  accentGrad.addColorStop(1, "#22D3EE");
  ctx.strokeStyle = accentGrad;
  ctx.lineWidth = 2;
  ctx.strokeRect(80, 80, 64, 64);
  ctx.fillStyle = accentGrad;
  ctx.beginPath();
  ctx.arc(112, 112, 8, 0, Math.PI * 2);
  ctx.fill();

  // Title
  ctx.fillStyle = "#F3F4F8";
  ctx.font = "700 64px Arial, sans-serif";
  ctx.fillText("Crypto Agent", 80, 280);

  // Subtitle
  ctx.fillStyle = "#9CA3B8";
  ctx.font = "28px Arial, sans-serif";
  ctx.fillText("2222 Onchain Agents · Free Mint · Ethereum", 80, 330);

  // Username badge
  ctx.fillStyle = "#67E8F9";
  ctx.font = "600 26px Arial, sans-serif";
  ctx.fillText(`${xUsername} just joined the whitelist`, 80, 390);

  // CTA
  ctx.fillStyle = "#A78BFA";
  ctx.font = "600 24px Arial, sans-serif";
  ctx.fillText("Join before mint → agentpfp.live", 80, 440);

  // Footer link
  ctx.fillStyle = "#5B6178";
  ctx.font = "20px monospace";
  ctx.fillText("agentpfp.live", 80, 560);

  return canvas.toDataURL("image/png");
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  link.click();
}
