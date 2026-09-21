import type { Metadata } from 'next';
import Link from 'next/link';

/**
 * /privacy — the Privacy Policy URL on the App Store listing.
 *
 * Every statement here was checked against the code on 2026-09-21. If you add
 * a data flow (a new /api route, a new analytics call, a new stored id), update
 * this page, ios/App/App/PrivacyInfo.xcprivacy, and the App Privacy label in
 * App Store Connect together. The three must agree.
 *
 * Web only: scripts/build-offline.mjs drops every route not on its ROUTES
 * list, so this page is not in the iOS bundle (the listing links to the web).
 */

export const metadata: Metadata = {
  title: "Privacy Policy | Rookie's Revenge",
  description: "What Rookie's Revenge collects, why, and how to have it deleted.",
};

const CONTACT_EMAIL = 'tyler@tylervsnyc.com';

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-base font-bold text-chess-text mb-2">{children}</h2>;
}

function Mail() {
  return (
    <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-[#0b5f8f] underline [overflow-wrap:anywhere]">
      {CONTACT_EMAIL}
    </a>
  );
}

export default function PrivacyPage() {
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

        <h1 className="text-2xl font-black mt-2 mb-1">Privacy Policy</h1>
        <p className="text-sm text-chess-text-muted mb-8">Effective September 21, 2026</p>

        <div className="space-y-7 text-[15px] leading-relaxed text-chess-text">
          <section>
            <p>
              This policy covers Rookie&apos;s Revenge, the iOS app and the website at run.chesspath.app
              (together, &ldquo;the game&rdquo;). The game is made by Learn Through Stories LLC
              (&ldquo;we&rdquo;, &ldquo;us&rdquo;).
            </p>
            <p className="mt-3">
              The short version: you never need an account to play. The game does not ask for your name,
              email address, phone number, or contacts. It shows no ads, uses no advertising identifier, does
              not track you across other companies&apos; apps or websites, and has no in-app purchases. We do
              not sell your data. What we do collect is described below, all of it.
            </p>
          </section>

          <section>
            <H2>1. What stays on your device</H2>
            <p>
              Your progress lives in the app&apos;s storage on your device: unlocked abilities, trophies, run
              history, difficulty unlocks, your personal bests, whether you have seen the tutorial, and
              settings. That progress is not uploaded; the only things sent off your device are the ones in
              sections 2 to 4. The
              device also holds two random IDs the game creates on first launch (a player ID for the
              leaderboard and an install ID for gameplay records), your leaderboard name, and a short queue of
              scores waiting to be sent if you finished a run without a connection. Deleting the app, or
              clearing the website&apos;s data in your browser, erases all of it.
            </p>
          </section>

          <section>
            <H2>2. The daily leaderboard</H2>
            <p>When a run ends, the game sends our server:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>the random player ID created on your device;</li>
              <li>
                your leaderboard name, which starts as a random name like &ldquo;Rook-1234&rdquo; and can be
                changed by you (2 to 16 letters, digits, dots, dashes, or underscores);
              </li>
              <li>
                the date, which run you played, the difficulty, levels cleared, total levels, number of
                captures, and whether you finished.
              </li>
            </ul>
            <p className="mt-3">
              <strong>The leaderboard is public.</strong> Your leaderboard name and scores, and the random
              player ID attached to them, can be seen by anyone who plays or visits the game. Please do not
              use your real name or anything that identifies you as your leaderboard name.
            </p>
          </section>

          <section>
            <H2>3. Gameplay records</H2>
            <p>
              When a run ends, the game also sends a record of that run: every move and game event (yours,
              your allies&apos;, and the enemy&apos;s), board positions, the level reached, the difficulty,
              the outcome, when the run started, and the random install ID, which groups records from the
              same device. We use these records to balance levels, find bugs, and test the game&apos;s
              computer opponents. They are stored privately and are not shown to other players.
            </p>
            <p className="mt-3">
              The game also tells our server when you finish the daily run (the date, the run, levels
              cleared, and your device&apos;s time zone setting, such as &ldquo;America/New_York&rdquo;).
              This is only saved for signed-in players. Rookie&apos;s Revenge does not offer sign-in, so
              today it is not stored.
            </p>
          </section>

          <section>
            <H2>4. Analytics and session replay (PostHog)</H2>
            <p>
              We use PostHog, a product analytics service, to understand how people play and where they get
              stuck. PostHog receives:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                what you do in the game: screens viewed, taps and clicks, when you leave a page, and game
                events such as starting a run, reaching the next level, sharing a result, or skipping the
                tutorial;
              </li>
              <li>
                <strong>session recordings</strong>: a replay of what appeared on screen and how you moved
                through it, including taps, scrolling, text you type into the game (the only text field is
                your leaderboard name), and technical log messages from the page;
              </li>
              <li>
                device and connection details: device type, operating system, browser, screen size, whether
                you are in the iOS app or on the website, and your IP address, which PostHog stores and uses
                to estimate your approximate location (country and city);
              </li>
              <li>
                a random PostHog ID, kept in your device&apos;s storage (and a cookie on the website), that
                ties these events to one anonymous profile.
              </li>
            </ul>
            <p className="mt-3">
              PostHog does not receive your name, email address, or contact details, because the game never
              has them.
            </p>
          </section>

          <section>
            <H2>5. Who handles the data</H2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Supabase</strong> stores the leaderboard and gameplay records.
              </li>
              <li>
                <strong>PostHog</strong> stores analytics and session recordings (section 4).
              </li>
              <li>
                <strong>Vercel</strong> hosts the website and our server. Like any web server, it processes
                your IP address and basic request logs to deliver the game.
              </li>
            </ul>
            <p className="mt-3">
              Each processes data on our behalf under its own privacy terms. We do not share your data with
              anyone else, except if the law requires it.
            </p>
          </section>

          <section>
            <H2>6. How we use it</H2>
            <p>
              To run the leaderboard, to make the game better (balancing levels, fixing bugs, improving the
              tutorial), and to keep the service working. We do not use it for advertising, and we do not
              combine it with data from other companies to track you.
            </p>
          </section>

          <section>
            <H2>7. How long we keep it, and deleting it</H2>
            <p>
              We keep leaderboard entries and gameplay records until you ask us to delete them or we no
              longer need them. Analytics and session recordings are kept for as long as our PostHog plan
              retains them.
            </p>
            <p className="mt-3">
              To have your data deleted, email <Mail /> with your leaderboard name and roughly when you
              played. There is no account to look you up by, so your leaderboard name is how we find your
              entries. We will delete your leaderboard entries and any gameplay records and analytics we can
              match to them, and reply to confirm. To erase what is on your device, delete the app, or clear
              the site&apos;s data in your browser.
            </p>
          </section>

          <section>
            <H2>8. Children</H2>
            <p>
              Rookie&apos;s Revenge is rated 4+ on the App Store, meaning its content is suitable for all
              ages. It is a general-audience game and is not directed at children under 13. We do not
              knowingly collect personal information from children under 13. If you are a parent or guardian
              and believe your child has put personal information in a leaderboard name, email <Mail /> and
              we will delete it.
            </p>
          </section>

          <section>
            <H2>9. Changes</H2>
            <p>
              If the game starts collecting anything new (for example, if we add optional sign-in), we will
              update this page and the date at the top before that change ships.
            </p>
          </section>

          <section>
            <H2>10. Contact</H2>
            <p>
              Learn Through Stories LLC. Questions or requests: <Mail />.
            </p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-chess-disabled text-sm">
          <Link href="/support" className="inline-flex min-h-[44px] items-center font-semibold text-[#0b5f8f] hover:underline">
            Support
          </Link>
        </div>
      </div>
    </main>
  );
}
