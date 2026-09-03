/**
 * App Store Connect listing for Rookie's Revenge — fully via the ASC API.
 *
 *   node scripts/asc-listing.mjs            # apply metadata (idempotent)
 *   node scripts/asc-listing.mjs --shots    # also replace the iPhone screenshot set
 *   node scripts/asc-listing.mjs --submit   # attach the build + submit for review
 *   node scripts/asc-listing.mjs --status   # print the live state, change nothing
 *
 * Copy lives in docs/appstore-metadata.md — edit there, then re-run.
 * The ONLY thing this cannot do is the App Privacy label (no API); see docs.
 * Auth: the shared Apple API key at ~/Downloads/AuthKey_767R5DY9P3.p8.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createPrivateKey, sign, createHash } from 'node:crypto';

const KEY_ID = '767R5DY9P3';
const ISS = 'ec78424a-d56e-4da4-ace6-cc4e91f8bb49';
const KEY_FILE = path.join(process.env.HOME, 'Downloads/AuthKey_767R5DY9P3.p8');
const BUNDLE_ID = 'com.learnthroughstories.rookiesrun';
const VERSION_STRING = process.env.VERSION || '1.0';
const BUILD_NO = process.env.BUILD || null; // default: newest VALID build
const SHOT_DIR = path.resolve('data/appstore/screenshots');

const args = new Set(process.argv.slice(2));

// ---------- copy (mirrors docs/appstore-metadata.md) ----------
const COPY = {
  name: "Rookie's Revenge",
  subtitle: 'A Chess Roguelike',
  privacyPolicyUrl: 'https://run.chesspath.app/privacy',
  supportUrl: 'https://run.chesspath.app/support',
  marketingUrl: 'https://run.chesspath.app/',
  copyright: '2026 Learn Through Stories LLC',
  keywords: 'chess,roguelike,daily,puzzle,strategy,board,tactics,rook,king,deckbuilder,run,levels',
  promotionalText:
    'New board every day. Cross 10 escalating levels, corner the king, and unlock powers that break the rules of chess. Rookie lost the game. She took that personally.',
  description: `The game ended. And Rookie took that personally.

Rookie's Revenge is a daily chess roguelike. You are one rook. Across the board, behind walls and bodyguards, hides the enemy king. Cross 10 escalating levels, break through his defenses, and take him down - in a run that changes every single day.

HOW IT WORKS
- Move like a rook. Capture like a rook. Every capture charges your tempo.
- Each level is a puzzle-battlefield: pawn shells, sightline queens, walls with one door, keys that unlock his file.
- Reach the king before your moves run out. Then do it nine more levels in a row.

POWERS THAT BREAK CHESS
Pick ability cards as you climb: hop like a knight, freeze a defender, summon a piece you control, drop a boulder to seal a file, or become the king himself. Every ability refills at the top of every level, so spend them where they hurt.

A NEW RUN EVERY DAY
The daily rotates through hand-tuned runs - each with its own personality and lesson. Miss a day, and that board is gone.

EARN YOUR ARSENAL
Trophies track everything from your first king to a flawless run, and unlock new abilities permanently. Four difficulties, from Rookie (training wheels, some judgment) to Nightmare (he sees everything).

ACTUALLY LEARN CHESS
Every mechanic is real chess underneath: forks, skewers, overloaded defenders, zugzwang. You will start seeing sightlines and weak squares everywhere - including in your regular games.

From the makers of The Chess Path (chesspath.app), the friendly way to learn chess from zero.`,
  reviewNotes: `Rookie's Revenge is a daily chess roguelike: the player controls a single rook and crosses the board in 10 escalating levels to capture the enemy king, earning abilities between levels. A new board rotates in every day.

No account is required and there is no sign-in anywhere in the app. Progress (abilities, trophies, difficulty unlocks) is stored on device. There are no purchases, no ads, and no user generated content beyond an optional leaderboard handle (a random "Rook-1234" name the player may rename).

Native features: haptic feedback on moves, captures, ability plays, level clears and defeats; native splash and status bar theming; portrait lock; branded offline screen.

To reach gameplay immediately: launch the app, tap GO GET HIM on the daily card and play. The tutorial (5 short beats) runs on first launch only. Tap Rookie (the colorful rook) to see her legal moves, then tap a square.

--- Guideline 2.1 info ---
TESTED ON: iPhone 15 Pro (iOS 26.6) via TestFlight since Aug 17, 2026.
AUDIENCE/VALUE: chess beginners and puzzle-game players; a daily roguelike that teaches real chess ideas (sightlines, forks, overloaded defenders). Free, no ads, no in-app purchases.
EXTERNAL SERVICES: PostHog (first-party product analytics, no cross-app tracking, no ATT) and Supabase (stores daily leaderboard scores keyed by a random device id). No payment processor, no login.
REGIONS: functions identically in all regions (English).
REGULATED/THIRD-PARTY: not a regulated industry; all content is original.`,
  contact: { first: 'Tyler', last: 'Schwartz', phone: '18479515080', email: 'tyler@tylervsnyc.com' },
};

// ---------- API plumbing ----------
function jwt() {
  const key = createPrivateKey(fs.readFileSync(KEY_FILE));
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
  const now = Math.floor(Date.now() / 1000);
  const h = b64({ alg: 'ES256', kid: KEY_ID, typ: 'JWT' });
  const p = b64({ iss: ISS, iat: now, exp: now + 1200, aud: 'appstoreconnect-v1' });
  const s = sign('sha256', Buffer.from(h + '.' + p), { key, dsaEncoding: 'ieee-p1363' }).toString('base64url');
  return `${h}.${p}.${s}`;
}
const H = { Authorization: 'Bearer ' + jwt(), 'Content-Type': 'application/json' };
async function api(method, p, body, base = 'https://api.appstoreconnect.apple.com/v1') {
  const r = await fetch(base + p, { method, headers: H, body: body ? JSON.stringify(body) : undefined });
  const t = await r.text();
  let j; try { j = JSON.parse(t); } catch { j = { raw: t }; }
  if (r.status >= 300) throw new Error(`${method} ${p} ${r.status} ${JSON.stringify(j.errors || j).slice(0, 400)}`);
  return j;
}
const rel = (type, id) => ({ data: { type, id } });
const log = (...a) => console.log(...a);

// ---------- steps ----------
async function main() {
  const app = (await api('GET', `/apps?filter[bundleId]=${BUNDLE_ID}`)).data[0];
  if (!app) throw new Error('no ASC app record for ' + BUNDLE_ID);
  log(`app ${app.id} "${app.attributes.name}"`);

  const info = (await api('GET', `/apps/${app.id}/appInfos`)).data.find((i) => i.attributes.state === 'PREPARE_FOR_SUBMISSION') || (await api('GET', `/apps/${app.id}/appInfos`)).data[0];
  const versions = (await api('GET', `/apps/${app.id}/appStoreVersions?filter[platform]=IOS`)).data;
  let version = versions.find((v) => v.attributes.versionString === VERSION_STRING);

  if (args.has('--status')) {
    const il = (await api('GET', `/appInfos/${info.id}/appInfoLocalizations`)).data[0];
    log('appInfo', info.attributes.state, JSON.stringify(il.attributes));
    for (const v of versions) {
      log('version', v.attributes.versionString, v.attributes.appVersionState, 'copyright=' + v.attributes.copyright);
      const vl = (await api('GET', `/appStoreVersions/${v.id}/appStoreVersionLocalizations`)).data[0];
      const a = vl.attributes; log('  ', { keywords: a.keywords, promo: !!a.promotionalText, desc: (a.description || '').length + ' chars', support: a.supportUrl });
      const sets = (await api('GET', `/appStoreVersionLocalizations/${vl.id}/appScreenshotSets?include=appScreenshots`)).data;
      for (const s of sets) log('   shots', s.attributes.screenshotDisplayType, (s.relationships.appScreenshots.data || []).length);
      const b = (await api('GET', `/appStoreVersions/${v.id}/build`)).data; log('   build', b ? b.attributes.version : 'NONE');
      const rd = (await api('GET', `/appStoreVersions/${v.id}/appStoreReviewDetail`)).data; log('   review contact', rd ? rd.attributes.contactEmail : 'NONE');
    }
    const builds = (await api('GET', `/builds?filter[app]=${app.id}&sort=-uploadedDate&limit=3`)).data;
    for (const b of builds) log('testflight build', b.attributes.version, b.attributes.processingState);
    return;
  }

  if (!version) {
    version = (await api('POST', '/appStoreVersions', { data: { type: 'appStoreVersions', attributes: { platform: 'IOS', versionString: VERSION_STRING, releaseType: 'AFTER_APPROVAL' }, relationships: { app: rel('apps', app.id) } } })).data;
    log('created version', VERSION_STRING);
  }

  if (!args.has('--submit') && !args.has('--shots')) {
    // --- app-level ---
    if (app.attributes.contentRightsDeclaration !== 'DOES_NOT_USE_THIRD_PARTY_CONTENT') {
      await api('PATCH', `/apps/${app.id}`, { data: { type: 'apps', id: app.id, attributes: { contentRightsDeclaration: 'DOES_NOT_USE_THIRD_PARTY_CONTENT' } } });
      log('content rights: original content');
    }
    const il = (await api('GET', `/appInfos/${info.id}/appInfoLocalizations`)).data.find((l) => l.attributes.locale === 'en-US');
    await api('PATCH', `/appInfoLocalizations/${il.id}`, { data: { type: 'appInfoLocalizations', id: il.id, attributes: { name: COPY.name, subtitle: COPY.subtitle, privacyPolicyUrl: COPY.privacyPolicyUrl } } });
    log('name/subtitle/privacy URL set');

    await api('PATCH', `/appInfos/${info.id}`, { data: { type: 'appInfos', id: info.id, relationships: {
      primaryCategory: rel('appCategories', 'GAMES'),
      primarySubcategoryOne: rel('appCategories', 'GAMES_BOARD'),
      primarySubcategoryTwo: rel('appCategories', 'GAMES_STRATEGY'),
      secondaryCategory: rel('appCategories', 'EDUCATION'),
    } } });
    log('categories: Games > Board, Strategy; secondary Education');

    const ar = (await api('GET', `/appInfos/${info.id}/ageRatingDeclaration`)).data;
    const none = {};
    for (const k of ['alcoholTobaccoOrDrugUseOrReferences', 'contests', 'gamblingSimulated', 'medicalOrTreatmentInformation', 'profanityOrCrudeHumor', 'sexualContentGraphicAndNudity', 'sexualContentOrNudity', 'horrorOrFearThemes', 'matureOrSuggestiveThemes', 'violenceCartoonOrFantasy', 'violenceRealisticProlongedGraphicOrSadistic', 'violenceRealistic', 'gunsOrOtherWeapons']) none[k] = 'NONE';
    for (const k of ['advertising', 'gambling', 'lootBox', 'messagingAndChat', 'parentalControls', 'unrestrictedWebAccess', 'userGeneratedContent', 'healthOrWellnessTopics', 'socialMedia', 'socialMediaAgeRestricted', 'ageAssurance']) none[k] = false;
    await api('PATCH', `/ageRatingDeclarations/${ar.id}`, { data: { type: 'ageRatingDeclarations', id: ar.id, attributes: none } });
    log('age rating: nothing declared (4+)');

    // --- version-level ---
    await api('PATCH', `/appStoreVersions/${version.id}`, { data: { type: 'appStoreVersions', id: version.id, attributes: { copyright: COPY.copyright, releaseType: 'AFTER_APPROVAL' } } });
    const vl = (await api('GET', `/appStoreVersions/${version.id}/appStoreVersionLocalizations`)).data.find((l) => l.attributes.locale === 'en-US');
    await api('PATCH', `/appStoreVersionLocalizations/${vl.id}`, { data: { type: 'appStoreVersionLocalizations', id: vl.id, attributes: {
      description: COPY.description, keywords: COPY.keywords, promotionalText: COPY.promotionalText, supportUrl: COPY.supportUrl, marketingUrl: COPY.marketingUrl,
    } } });
    log('description/keywords/promo/URLs/copyright set');

    const rd = (await api('GET', `/appStoreVersions/${version.id}/appStoreReviewDetail`)).data;
    const rdAttrs = { contactFirstName: COPY.contact.first, contactLastName: COPY.contact.last, contactPhone: COPY.contact.phone, contactEmail: COPY.contact.email, demoAccountRequired: false, notes: COPY.reviewNotes };
    if (rd) await api('PATCH', `/appStoreReviewDetails/${rd.id}`, { data: { type: 'appStoreReviewDetails', id: rd.id, attributes: rdAttrs } });
    else await api('POST', '/appStoreReviewDetails', { data: { type: 'appStoreReviewDetails', attributes: rdAttrs, relationships: { appStoreVersion: rel('appStoreVersions', version.id) } } });
    log('review contact + notes set');

    // --- price: free in USA (review 409s without a schedule) ---
    const sched = await api('GET', `/apps/${app.id}/appPriceSchedule`).catch(() => ({ data: null }));
    const hasManual = sched.data && (await api('GET', `/appPriceSchedules/${app.id}/manualPrices?limit=1`).catch(() => ({ data: [] }))).data.length > 0;
    if (!hasManual) {
      const pts = (await api('GET', `/apps/${app.id}/appPricePoints?filter[territory]=USA&limit=1`)).data;
      const free = pts[0];
      await api('POST', '/appPriceSchedules', { data: { type: 'appPriceSchedules', relationships: {
        app: rel('apps', app.id), baseTerritory: rel('territories', 'USA'),
        manualPrices: { data: [{ type: 'appPrices', id: '${price0}' }] },
      } }, included: [{ type: 'appPrices', id: '${price0}', attributes: { startDate: null }, relationships: { appPricePoint: rel('appPricePoints', free.id) } }] });
      log('price schedule: free (USA base)');
    } else log('price schedule exists');

    // --- availability: every territory ---
    const avail = await api('GET', `/appAvailabilities/${app.id}`, null, 'https://api.appstoreconnect.apple.com/v2').catch(() => null);
    if (!avail) {
      const terr = (await api('GET', '/territories?limit=200')).data.map((t) => t.id);
      await api('POST', '/appAvailabilities', { data: { type: 'appAvailabilities', attributes: { availableInNewTerritories: true }, relationships: {
        app: rel('apps', app.id),
        territoryAvailabilities: { data: terr.map((t) => ({ type: 'territoryAvailabilities', id: '${' + t + '}' })) },
      } }, included: terr.map((t) => ({ type: 'territoryAvailabilities', id: '${' + t + '}', attributes: { available: true }, relationships: { territory: rel('territories', t) } })) }, 'https://api.appstoreconnect.apple.com/v2');
      log(`availability: ${terr.length} territories`);
    } else log('availability already set');
  }

  if (args.has('--shots')) {
    const files = fs.readdirSync(SHOT_DIR).filter((f) => /\.png$/i.test(f)).sort();
    if (!files.length) throw new Error('no PNGs in ' + SHOT_DIR);
    const vl = (await api('GET', `/appStoreVersions/${version.id}/appStoreVersionLocalizations`)).data.find((l) => l.attributes.locale === 'en-US');
    const sets = (await api('GET', `/appStoreVersionLocalizations/${vl.id}/appScreenshotSets`)).data;
    let set = sets.find((s) => s.attributes.screenshotDisplayType === 'APP_IPHONE_67');
    if (!set) set = (await api('POST', '/appScreenshotSets', { data: { type: 'appScreenshotSets', attributes: { screenshotDisplayType: 'APP_IPHONE_67' }, relationships: { appStoreVersionLocalization: rel('appStoreVersionLocalizations', vl.id) } } })).data;
    const old = (await api('GET', `/appScreenshotSets/${set.id}/appScreenshots`)).data;
    for (const o of old) await api('DELETE', `/appScreenshots/${o.id}`);
    log(`screenshots: cleared ${old.length} old`);
    const ids = [];
    for (const f of files) {
      const buf = fs.readFileSync(path.join(SHOT_DIR, f));
      const shot = (await api('POST', '/appScreenshots', { data: { type: 'appScreenshots', attributes: { fileName: f, fileSize: buf.length }, relationships: { appScreenshotSet: rel('appScreenshotSets', set.id) } } })).data;
      for (const op of shot.attributes.uploadOperations) {
        const hd = Object.fromEntries(op.requestHeaders.map((h) => [h.name, h.value]));
        const r = await fetch(op.url, { method: op.method, headers: hd, body: buf.subarray(op.offset, op.offset + op.length) });
        if (r.status >= 300) throw new Error('chunk upload ' + r.status);
      }
      await api('PATCH', `/appScreenshots/${shot.id}`, { data: { type: 'appScreenshots', id: shot.id, attributes: { uploaded: true, sourceFileChecksum: createHash('md5').update(buf).digest('hex') } } });
      ids.push(shot.id); log('  uploaded', f);
    }
    await api('PATCH', `/appScreenshotSets/${set.id}/relationships/appScreenshots`, { data: ids.map((id) => ({ type: 'appScreenshots', id })) });
    log('screenshot order set');
  }

  if (args.has('--submit')) {
    const builds = (await api('GET', `/builds?filter[app]=${app.id}&sort=-uploadedDate&limit=10`)).data;
    const build = BUILD_NO ? builds.find((b) => b.attributes.version === String(BUILD_NO)) : builds.find((b) => b.attributes.processingState === 'VALID');
    if (!build) throw new Error('no usable build');
    if (build.attributes.usesNonExemptEncryption == null) await api('PATCH', `/builds/${build.id}`, { data: { type: 'builds', id: build.id, attributes: { usesNonExemptEncryption: false } } });
    await api('PATCH', `/appStoreVersions/${version.id}/relationships/build`, { data: { type: 'builds', id: build.id } });
    log(`attached build ${build.attributes.version} to ${VERSION_STRING}`);
    let sub = (await api('GET', `/apps/${app.id}/reviewSubmissions?filter[state]=READY_FOR_REVIEW,UNRESOLVED_ISSUES,WAITING_FOR_REVIEW`)).data.find((s) => s.attributes.state === 'READY_FOR_REVIEW');
    if (!sub) sub = (await api('POST', '/reviewSubmissions', { data: { type: 'reviewSubmissions', attributes: { platform: 'IOS' }, relationships: { app: rel('apps', app.id) } } })).data;
    await api('POST', '/reviewSubmissionItems', { data: { type: 'reviewSubmissionItems', relationships: { reviewSubmission: rel('reviewSubmissions', sub.id), appStoreVersion: rel('appStoreVersions', version.id) } } }).catch((e) => log('item:', e.message.slice(0, 160)));
    await api('PATCH', `/reviewSubmissions/${sub.id}`, { data: { type: 'reviewSubmissions', id: sub.id, attributes: { submitted: true } } });
    const fresh = (await api('GET', `/appStoreVersions/${version.id}`)).data;
    log(`SUBMITTED ${VERSION_STRING} build ${build.attributes.version} — state=${fresh.attributes.appVersionState}`);
  }
}

main().catch((e) => { console.error('FAILED:', e.message); process.exit(1); });
