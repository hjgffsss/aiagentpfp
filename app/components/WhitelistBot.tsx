"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Twitter,
  Share2,
  ExternalLink,
  Loader2,
  CheckCircle2,
  Wallet,
} from "lucide-react";
import { useAccount, useDisconnect, useSignMessage } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { buildSignMessage, generateNonce, verifySignature } from "@/lib/wallet-verify";
import { generateShareBanner } from "@/lib/share-banner";
import TypingIndicator from "./TypingIndicator";
import type { ChatStepData } from "@/lib/types";

type Sender = "bot" | "user";
interface Message {
  id: string;
  sender: Sender;
  content: React.ReactNode;
}

function makeId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function WhitelistBot({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState(false);
  const [step, setStep] = useState(0);
  const [data, setData] = useState<ChatStepData>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [signing, setSigning] = useState(false);
  const [walletError, setWalletError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const initRef = useRef(false);

  // ---------- Real wallet connection (wagmi + WalletConnect) ----------
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const { open } = useWeb3Modal();

  // Types a bot message with a realistic delay so it reads like a live
  // assistant rather than instantly dumped text.
  async function pushBot(content: React.ReactNode, delayMs = 700) {
    setTyping(true);
    await new Promise((r) => setTimeout(r, delayMs));
    setTyping(false);
    setMessages((m) => [...m, { id: makeId(), sender: "bot", content }]);
  }

  function pushUser(content: React.ReactNode) {
    setMessages((m) => [...m, { id: makeId(), sender: "user", content }]);
  }

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    pushBot(
      <>
        GM! Welcome to the Crypto Agent ecosystem. We are thrilled to have
        you here. There are only 2,222 unique Agents available in this
        exclusive collection, and you are one step away from securing your
        spot. Let&apos;s get started with your verification process.
      </>,
      400
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  // When wagmi reports a successful connection, run the signature step.
  useEffect(() => {
    if (isConnected && address && step === 1 && !data.walletVerified) {
      void runSignatureVerification(address);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, address, step]);

  async function runSignatureVerification(addr: string) {
    setSigning(true);
    setWalletError(null);
    try {
      const nonce = generateNonce();
      const message = buildSignMessage(addr, nonce);
      const signature = await signMessageAsync({ message });
      const valid = verifySignature(message, signature, addr);

      if (!valid) {
        setWalletError("That signature didn't verify. Please try connecting again.");
        disconnect();
        return;
      }

      setData((d) => ({ ...d, walletAddress: addr, walletVerified: true }));
      pushUser(`Connected: ${addr.slice(0, 6)}…${addr.slice(-4)}`);
      await pushBot(
        <span className="flex items-center gap-2 text-agent-cyan">
          <CheckCircle2 size={16} /> Wallet verified successfully.
        </span>,
        500
      );
      goToStep(2);
    } catch (err) {
      setWalletError(
        "Signature request was cancelled or failed. You can try again whenever you're ready."
      );
      disconnect();
    } finally {
      setSigning(false);
    }
  }

  async function goToStep(n: number) {
    setStep(n);
    if (n === 1) {
      await pushBot(
        <>
          To begin, please connect your crypto wallet. Please note: This is
          strictly for address verification purposes only. We will not ask
          for any transactions, and your funds will remain completely safe.
          Your security is our top priority. Please proceed with confidence
          to link your address.
        </>
      );
    }
    if (n === 2) {
      await pushBot(
        <>
          Great! Now, let&apos;s stay connected. Please follow our official
          Crypto Agent X (Twitter) account to get the latest updates and
          community news. Once you&apos;ve followed, please enter your X
          username below so we can verify your account.
        </>
      );
    }
    if (n === 3) {
      await pushBot(
        <>
          Awesome! Now, let&apos;s spread the word. Please like and retweet
          our pinned post on X. This simple action helps our community grow
          stronger together. Let us know once you have completed this step.
        </>
      );
    }
    if (n === 4) {
      await pushBot(
        <>
          Almost there! For the final step, please create a new post on X
          mentioning @CryptoAgent and include the hashtag #CryptoAgent to
          show your support. Once you have posted, simply paste the link to
          your post below to complete your submission.
        </>
      );
    }
  }

  function confirmFollow(username: string) {
    const handle = username.startsWith("@") ? username : `@${username}`;
    pushUser(handle);
    setData((d) => ({ ...d, followConfirmed: true, xUsername: handle }));
    goToStep(3);
  }

  function confirmRetweet() {
    pushUser("Done — liked and retweeted!");
    goToStep(4);
  }

  async function submitRepostUrl(url: string) {
    pushUser(url);
    setData((d) => ({ ...d, repostUrl: url }));
    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: data.walletAddress,
          xUsername: data.xUsername,
          repostUrl: url,
          notes: data.notes ?? "",
        }),
      });
      const result = await res.json();
      if (!res.ok) {
        setSubmitError(result.error ?? "Submission failed. Please try again.");
        setSubmitting(false);
        return;
      }
      await pushBot(
        <>
          Verification successful! Thank you for being a part of the Crypto
          Agent journey. We have received your details, and our team will
          review them shortly. Keep an eye on your notifications for further
          updates. Welcome to the future!
        </>,
        500
      );
      setSubmitted(true);
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        className="relative w-full h-full sm:h-[88vh] sm:max-w-xl glass-strong sm:rounded-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-edge shrink-0">
          <div className="flex items-center gap-3">
            <Image src="/images/bot-avatar.png" alt="" width={36} height={36} />
            <div>
              <div className="font-display font-semibold text-sm text-text-primary">
                Crypto Agent Assistant
              </div>
              <div className="text-[11px] text-agent-cyan flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-agent-cyan animate-pulse-slow" />
                Online
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/5 text-text-secondary"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.sender === "user"
                    ? "bg-agent-gradient text-white"
                    : "glass text-text-primary"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex justify-start">
              <div className="glass rounded-2xl px-4 py-2.5">
                <TypingIndicator />
              </div>
            </div>
          )}

          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-border-gradient glass rounded-xl2 p-6 text-center mt-2"
            >
              <CheckCircle2 size={32} className="mx-auto text-agent-cyan mb-3" />
              <h3 className="font-display font-semibold text-lg text-text-primary">
                Congratulations Agent.
              </h3>
              <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                Your whitelist application has been submitted successfully.
              </p>
              <div className="mt-5 flex gap-3 justify-center flex-wrap">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-edge text-sm text-text-primary hover:bg-white/5"
                >
                  Return Home
                </button>
                <ShareOnX data={data} />
              </div>
            </motion.div>
          )}
        </div>

        {/* Step controls */}
        {!submitted && !typing && (
          <div className="border-t border-edge p-4 shrink-0">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="s0" {...stepAnim} className="flex justify-end">
                  <button
                    onClick={() => goToStep(1)}
                    className="px-5 py-2.5 rounded-xl bg-agent-gradient text-white text-sm font-medium"
                  >
                    Begin Verification
                  </button>
                </motion.div>
              )}

              {step === 1 && !data.walletVerified && (
                <motion.div key="s1" {...stepAnim} className="space-y-2">
                  <button
                    onClick={() => open()}
                    disabled={signing}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-agent-gradient text-white text-sm font-medium disabled:opacity-60"
                  >
                    {signing ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Waiting for signature…
                      </>
                    ) : (
                      <>
                        <Wallet size={16} /> Connect Wallet
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-text-muted text-center">
                    Opens WalletConnect — works with Bitget, OKX, Trust
                    Wallet, MetaMask, and 300+ other wallets via QR code or
                    deep link.
                  </p>
                  {walletError && (
                    <p className="text-xs text-red-400 text-center">{walletError}</p>
                  )}
                </motion.div>
              )}

              {step === 2 && (
                <UsernameInput key="s2" onSubmit={confirmFollow} />
              )}

              {step === 3 && (
                <motion.div key="s3" {...stepAnim} className="flex gap-2 justify-end flex-wrap">
                  <a
                    href="https://x.com/CryptoAgent"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl glass text-sm text-text-primary flex items-center gap-2"
                  >
                    <Twitter size={14} /> Open Pinned Post
                  </a>
                  <button
                    onClick={confirmRetweet}
                    className="px-5 py-2.5 rounded-xl bg-agent-gradient text-white text-sm font-medium"
                  >
                    Done
                  </button>
                </motion.div>
              )}

              {step === 4 && (
                <RepostInput key="s4" onSubmit={submitRepostUrl} submitting={submitting} />
              )}

              {submitError && step === 4 && (
                <p className="mt-2 text-xs text-red-400">{submitError}</p>
              )}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
}

const stepAnim = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.2 },
};

function UsernameInput({ onSubmit }: { onSubmit: (username: string) => void }) {
  const [v, setV] = useState("");

  return (
    <motion.form
      {...stepAnim}
      onSubmit={(e) => {
        e.preventDefault();
        if (v.trim()) onSubmit(v.trim());
      }}
      className="flex gap-2"
    >
      <input
        autoFocus
        value={v}
        onChange={(e) => setV(e.target.value)}
        placeholder="@username"
        className="flex-1 px-4 py-2.5 rounded-xl bg-black/30 border border-edge text-text-primary placeholder:text-text-muted outline-none focus:border-agent-cyan/50 text-sm"
      />
      <button
        type="submit"
        className="px-5 py-2.5 rounded-xl bg-agent-gradient text-white text-sm font-medium shrink-0"
      >
        Next
      </button>
    </motion.form>
  );
}

function RepostInput({
  onSubmit,
  submitting,
}: {
  onSubmit: (v: string) => void;
  submitting: boolean;
}) {
  const [v, setV] = useState("");
  const [opened, setOpened] = useState(false);
  return (
    <motion.div {...stepAnim} className="space-y-2.5">
      {!opened ? (
        <a
          href={`https://x.com/intent/tweet?text=${encodeURIComponent(
            "Joining @CryptoAgent — 2222 onchain agents, free mint, Ethereum. #CryptoAgent"
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setOpened(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass text-sm text-text-primary w-fit"
        >
          <ExternalLink size={14} /> Create Post
        </a>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (v.trim()) onSubmit(v.trim());
          }}
          className="flex gap-2"
        >
          <input
            autoFocus
            value={v}
            onChange={(e) => setV(e.target.value)}
            placeholder="https://x.com/yourpost/status/..."
            disabled={submitting}
            className="flex-1 px-4 py-2.5 rounded-xl bg-black/30 border border-edge text-text-primary placeholder:text-text-muted outline-none focus:border-agent-cyan/50 text-sm mono-num disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2.5 rounded-xl bg-agent-gradient text-white text-sm font-medium shrink-0 flex items-center gap-2 disabled:opacity-60"
          >
            {submitting && <Loader2 size={14} className="animate-spin" />}
            Submit
          </button>
        </form>
      )}
    </motion.div>
  );
}

function ShareOnX({ data }: { data: ChatStepData }) {
  const [generating, setGenerating] = useState(false);

  async function handleShare() {
    setGenerating(true);
    try {
      const bannerDataUrl = await generateShareBanner(data.xUsername ?? "@agent");

      // Try to share the image directly via the Web Share API where
      // supported (mobile browsers); otherwise fall back to opening the
      // X intent with text only and let the user attach the downloaded
      // image manually, since X's web intent cannot accept image uploads.
      const blob = await (await fetch(bannerDataUrl)).blob();
      const file = new File([blob], "crypto-agent-banner.png", { type: "image/png" });

      const text =
        "🚀 I just secured my spot on the Crypto Agent whitelist.\n\n" +
        "2222 AI-powered onchain agents.\nFree mint.\nEthereum.\n\n" +
        "Join before mint → agentpfp.live\n\n#CryptoAgent #Ethereum #Web3";

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ text, files: [file] });
      } else {
        const link = document.createElement("a");
        link.href = bannerDataUrl;
        link.download = "crypto-agent-banner.png";
        link.click();
        window.open(
          `https://x.com/intent/tweet?text=${encodeURIComponent(text)}`,
          "_blank"
        );
      }
    } finally {
      setGenerating(false);
    }
  }

  return (
    <button
      onClick={handleShare}
      disabled={generating}
      className="px-5 py-2.5 rounded-xl bg-agent-gradient text-white text-sm font-medium flex items-center gap-2 disabled:opacity-60"
    >
      {generating ? <Loader2 size={14} className="animate-spin" /> : <Share2 size={14} />}
      Share On X
    </button>
  );
}
