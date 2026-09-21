import type { Metadata } from 'next';
import Link from 'next/link';

/**
 * /support — the Support URL on the App Store listing.
 *
 * Every FAQ answer is true of the shipped code (2026-09-21): progress is
 * localStorage-only (FEATURE_FLAGS.ACCOUNTS / CLOUD_PROFILE are off), the
 * tutorial has a Skip button and a "Replay the tutorial" button in the Codex,
 * the handle is renamed from the Arena header (NameSheet in ArenaHome), and
 * scores finished offline wait in lib/net/outbox.ts. Change one, change this.
 *
 * Web only: not on scripts/build-offline.mjs ROUTES, so it never ships in the
 * iOS bundle.
 */

export const metadata: Metadata = {
  title: "Support | Rookie's Revenge",
  description: "Help with Rookie's Revenge: contact, progress, the tutorial, the leaderboard, and offline play.",
};

const SUPPORT_EMAIL = 'tyler@tylervsnyc.com';

const FAQ: { q: string; a: React.ReactNode }[] = [
  {
    q: 'Where is my progress saved?',
    a: (
      <>
        On your device. There are no accounts, so your abilities, trophies, and unlocks live in the app&apos;s
        storage on that phone (or in that browser, on the website). Deleting and reinstalling the app, or
        clearing the site&apos;s data, starts you over from scratch, and progress does not move between
        devices. Rookie takes that personally, so maybe don&apos;t.
      </>
    ),
  },
  {
    q: 'How do I skip or replay the tutorial?',
    a: (
      <>
        The tutorial runs once, on first launch. Tap <strong>Skip</strong> in the top corner to jump straight
        to the game. To see it again, open the <strong>Codex</strong> tab, tap the Codex card, and tap{' '}
        <strong>Replay the tutorial</strong>.
      </>
    ),
  },
  {
    q: 'How does the leaderboard name work?',
    a: (
      <>
        You start with a random name like &ldquo;Rook-1234&rdquo;. Tap your name at the top of the home screen
        to change it: 2 to 16 letters, digits, dots, dashes, or underscores. Your new name shows up on the
        board after your next run. The leaderboard is public, so pick a name, not your name.
      </>
    ),
  },
  {
    q: 'Can I play offline?',
    a: (
      <>
        Yes. The iOS app has the whole game on your phone, so it plays fully with no signal. Scores from runs
        you finish offline are saved and sent to the leaderboard the next time you open the app with a
        connection. The daily leaderboard itself needs a connection to update.
      </>
    ),
  },
];

export default function SupportPage() {
  return (
    <main
      className="h-full min-h-0 flex-1 overflow-y-auto overscroll-contain bg-chess-page text-chess-text"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="mx-auto w-full max-w-[640px] px-4 md:px-6 py-10">
        <Link
          href="/"
          className="inline-flex min-h-[44px] items-center text-sm font-semibold text-[#0b5f8f] hover:underline"
        >
          &larr; Back to Rookie&apos;s Revenge
        </Link>

        <h1 className="text-2xl font-black mt-2 mb-2">Rookie&apos;s Revenge Support</h1>
        <p className="text-[15px] leading-relaxed text-chess-text-muted mb-8">
          Rookie&apos;s Revenge is a daily chess roguelike. You are one rook against the whole army: cross the
          board, pick up abilities, and hunt the enemy king through ten escalating levels. Rookie is on your
          side. She is also a very sore loser.
        </p>

        <section className="bg-chess-surface rounded-2xl border border-chess-disabled/60 p-4 mb-8">
          <h2 className="text-base font-bold mb-1">Contact us</h2>
          <p className="text-[15px] leading-relaxed">
            Found a bug, stuck on a level, or want your leaderboard entry deleted? Email{' '}
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="font-semibold text-[#0b5f8f] underline [overflow-wrap:anywhere]"
            >
              {SUPPORT_EMAIL}
            </a>
            . A real person reads every message, usually within two business days.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold mb-3">Questions</h2>
          <div className="space-y-5">
            {FAQ.map(({ q, a }) => (
              <div key={q}>
                <h3 className="text-[15px] font-bold">{q}</h3>
                <p className="mt-1 text-[15px] leading-relaxed text-chess-text">{a}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-10 pt-6 border-t border-chess-disabled text-sm">
          <Link
            href="/privacy"
            className="inline-flex min-h-[44px] items-center font-semibold text-[#0b5f8f] hover:underline"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </main>
  );
}
