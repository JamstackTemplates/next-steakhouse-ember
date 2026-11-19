import assert from 'node:assert/strict';
import { test } from 'node:test';
import { business } from '../content/business.ts';
import { DAYS, openingLabel, validateHours, type OpeningHours } from '../lib/hours.ts';

const hours: OpeningHours[] = business.openingHours;
const at = (date: string, zone = 'America/New_York') => openingLabel(hours, zone, new Date(date));

test('opening inclusive, closing exclusive; business zone wins over visitor zone', () => {
  // Tuesday 2026-11-17 in America/New_York (EST, UTC-5): service is 17:00–22:00 (22:00Z–03:00Z next day).
  assert.equal(at('2026-11-17T21:59:00Z'), 'Closed · opens today at 17:00');
  assert.equal(at('2026-11-17T22:00:00Z'), 'Open now · until 22:00');
  assert.equal(at('2026-11-18T02:59:00Z'), 'Open now · until 22:00');
  assert.equal(at('2026-11-18T03:00:00Z'), 'Closed · opens Wednesday at 17:00');
  // Same instant evaluated in Asia/Tokyo (Wednesday 11:00 JST) reflects that zone's Wednesday 17:00 opening.
  assert.equal(at('2026-11-18T02:00:00Z', 'Asia/Tokyo'), 'Closed · opens today at 17:00');
});

test('Monday closure, Sunday-to-Tuesday rollover and all-days-closed schedules', () => {
  // Sunday 2026-11-15 in America/New_York (EST, UTC-5): service is 16:00–21:00 (21:00Z–02:00Z Monday UTC).
  assert.equal(at('2026-11-15T21:00:00Z'), 'Open now · until 21:00');
  // Sunday at 21:00 EST (2026-11-16T02:00:00Z): Sunday service ends and Monday is closed, so rolls over to Tuesday at 17:00.
  assert.equal(at('2026-11-16T02:00:00Z'), 'Closed · opens Tuesday at 17:00');
  // Monday afternoon in New York (2026-11-16T18:00:00Z): closed all day Monday, opens Tuesday at 17:00.
  assert.equal(at('2026-11-16T18:00:00Z'), 'Closed · opens Tuesday at 17:00');
  // All-days-closed schedule stays neutral/honest.
  assert.equal(openingLabel(DAYS.map(day => ({ day })), 'America/New_York'), 'Closed · see opening hours');
});

test('missing/invalid zones stay neutral and winter/summer DST boundaries preserve local service times', () => {
  assert.equal(at('2026-11-17T22:00:00Z', ''), 'See opening hours');
  assert.equal(at('2026-11-17T22:00:00Z', 'Mars/Base'), 'See opening hours');

  // US spring-forward day: Sunday 2026-03-08 (switches from EST UTC-5 to EDT UTC-4 at 02:00 local).
  // Sunday service opens at 16:00 EDT = 20:00Z.
  assert.equal(at('2026-03-08T19:59:00Z'), 'Closed · opens today at 16:00');
  assert.equal(at('2026-03-08T20:00:00Z'), 'Open now · until 21:00');

  // Summer Friday in EDT (UTC-4): Friday 2026-07-10 closes at 23:00 EDT (2026-07-11T03:00:00Z).
  assert.equal(at('2026-07-11T02:59:00Z'), 'Open now · until 23:00');
  assert.equal(at('2026-07-11T03:00:00Z'), 'Closed · opens Saturday at 17:00');

  // US fall-back day: Sunday 2026-11-01 (switches from EDT UTC-4 to EST UTC-5 at 02:00 local).
  // Sunday service opens at 16:00 EST = 21:00Z.
  assert.equal(at('2026-11-01T20:59:00Z'), 'Closed · opens today at 16:00');
  assert.equal(at('2026-11-01T21:00:00Z'), 'Open now · until 21:00');
});

test('invalid/incomplete/overnight intervals name the weekday to fix', () => {
  assert.doesNotThrow(() => validateHours(hours));
  for (const opens of ['24:00', '5:00', '22:00', '23:30']) {
    assert.throws(
      () => validateHours(hours.map(x => (x.day === 'Tuesday' ? { ...x, opens } : x))),
      /Tuesday/,
    );
  }
  assert.throws(() => validateHours(hours.slice(1)), /Monday/);
  assert.throws(
    () => validateHours(hours.map(x => (x.day === 'Tuesday' ? { ...x, closes: undefined } : x))),
    /Tuesday/,
  );
});
