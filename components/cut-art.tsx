import type { DonenessId, IllustrationArt, MenuItem, Pairing } from '../content/menu';
import { formatPrice } from '../content/menu';

/** Faceted ember & grill-iron crest used beside the wordmark and ledger markers. */
export function CoalNotchMark({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 28 28" className={className} fill="none">
      <path
        d="M4 1.5h20l2.5 2.5v20l-2.5 2.5H4L1.5 24V4L4 1.5Z"
        fill="var(--sear)"
        stroke="var(--rule)"
        strokeWidth="1.4"
      />
      <line x1="7.5" y1="4" x2="7.5" y2="24" stroke="var(--rule)" strokeWidth="1" strokeOpacity="0.55" />
      <line x1="20.5" y1="4" x2="20.5" y2="24" stroke="var(--rule)" strokeWidth="1" strokeOpacity="0.55" />
      <polygon
        points="14,4.2 21.2,11.5 18.2,22.8 9.8,22.8 6.8,11.5"
        fill="var(--accent)"
        stroke="var(--fat)"
        strokeWidth="1.2"
      />
      <polygon
        points="14,7.5 18.4,12 16.5,19.6 11.5,19.6 9.6,12"
        fill="var(--ember)"
        className="ember-glow"
      />
      <polygon points="14,10.8 16,13.2 14,16.5 12,13.2" fill="var(--fat)" />
    </svg>
  );
}

/** Stemmed Bordeaux glass outline for cellar and non-alcoholic pairing annotations. */
export function WineGlassGlyph({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 22" className={className} fill="none">
      <path
        d="M5.2 2.2h9.6l-.8 6.2a4.4 4.4 0 0 1-8 0l-.8-6.2Z"
        stroke="var(--wine)"
        strokeWidth="1.4"
        fill="var(--surface-raised)"
      />
      <path
        d="M5.9 7.2h8.2c-.3 2.4-1.9 4.2-4.1 4.2S6.2 9.6 5.9 7.2Z"
        fill="var(--wine)"
        fillOpacity="0.55"
      />
      <path d="M10 12.6v6.2M6.6 18.8h6.8" stroke="var(--wine)" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

/** Shared SVG gradients coloured strictly by CSS theme tokens for lifelike sear, marbling and ember glow. */
function CutArtDefs({ prefix }: { prefix: string }) {
  return (
    <defs>
      {/* Maillard seared beef surface gradient */}
      <linearGradient id={`${prefix}-meat`} x1="15%" y1="10%" x2="85%" y2="90%">
        <stop offset="0%" stopColor="var(--ember)" stopOpacity="0.92" />
        <stop offset="38%" stopColor="var(--accent)" stopOpacity="1" />
        <stop offset="82%" stopColor="var(--sear)" stopOpacity="0.96" />
        <stop offset="100%" stopColor="var(--sear)" stopOpacity="1" />
      </linearGradient>

      {/* Secondary muscle tone (spinalis / tenderloin contrast) */}
      <radialGradient id={`${prefix}-eye`} cx="45%" cy="42%" r="58%">
        <stop offset="0%" stopColor="var(--ember)" stopOpacity="0.55" />
        <stop offset="55%" stopColor="var(--accent)" stopOpacity="0.95" />
        <stop offset="100%" stopColor="var(--sear)" stopOpacity="0.95" />
      </radialGradient>

      {/* Rendered ivory beef tallow & fat cap gradient */}
      <linearGradient id={`${prefix}-fat`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="var(--fat)" stopOpacity="1" />
        <stop offset="65%" stopColor="var(--fat)" stopOpacity="0.88" />
        <stop offset="100%" stopColor="var(--ember)" stopOpacity="0.65" />
      </linearGradient>

      {/* Deep espresso-charred outer bark */}
      <linearGradient id={`${prefix}-crust`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="var(--sear)" stopOpacity="0.95" />
        <stop offset="100%" stopColor="var(--text)" stopOpacity="0.92" />
      </linearGradient>

      {/* Melting herb compound butter pat */}
      <radialGradient id={`${prefix}-butter`} cx="40%" cy="38%" r="60%">
        <stop offset="0%" stopColor="var(--fat)" stopOpacity="1" />
        <stop offset="68%" stopColor="var(--fat)" stopOpacity="0.92" />
        <stop offset="100%" stopColor="var(--ember)" stopOpacity="0.55" />
      </radialGradient>
    </defs>
  );
}

/** High-craft top-down chophouse cut geometry using token gradients, muscle seams, fat caps and char marks. */
function renderCutShape(art: IllustrationArt, prefix: string) {
  switch (art) {
    case 'ribeye':
      return (
        <g>
          {/* Drop shadow on grate */}
          <ellipse cx="118" cy="92" rx="94" ry="56" fill="var(--sear)" fillOpacity="0.48" />
          {/* 3D thick-cut side wall (2-inch chophouse cut thickness) */}
          <path
            d="M24 72 C20 100, 38 130, 78 138 C126 146, 186 138, 204 108 C212 94, 210 74, 200 60 C186 112, 122 126, 24 72 Z"
            fill={`url(#${prefix}-crust)`}
          />
          {/* Outer deeply seared crust rim */}
          <path
            d="M32 46 C50 18, 118 12, 166 26 C202 38, 216 72, 198 102 C180 132, 122 138, 72 128 C30 118, 14 72, 32 46 Z"
            fill="var(--sear)"
            stroke={`url(#${prefix}-fat)`}
            strokeWidth="2.8"
          />
          {/* Rendered golden-ivory outer fat cap */}
          <path
            d="M40 48 C58 22, 120 18, 162 30 C192 40, 204 68, 190 96 C174 122, 120 128, 74 118 C40 110, 26 70, 40 48 Z"
            fill={`url(#${prefix}-fat)`}
          />
          {/* Spinalis dorsi (crescent ribeye cap) */}
          <path
            d="M44 52 C62 28, 118 22, 156 34 C144 52, 98 58, 58 66 C44 68, 38 60, 44 52 Z"
            fill={`url(#${prefix}-meat)`}
          />
          {/* Longissimus dorsi (central ribeye eye) */}
          <path
            d="M50 74 C90 66, 142 58, 168 42 C190 52, 196 76, 182 96 C166 118, 118 124, 74 114 C44 108, 38 82, 50 74 Z"
            fill={`url(#${prefix}-eye)`}
          />
          {/* Signature ribeye tallow kernel & seam */}
          <ellipse cx="128" cy="60" rx="17" ry="9" transform="rotate(-11 128 60)" fill={`url(#${prefix}-fat)`} />
          <ellipse cx="70" cy="69" rx="8" ry="5.5" transform="rotate(8 70 69)" fill={`url(#${prefix}-fat)`} />
          {/* Fine branching intramuscular marbling */}
          <g stroke="var(--fat)" strokeLinecap="round" fill="none">
            <path d="M62 42 Q88 35 112 44 M118 36 Q138 31 150 40" strokeWidth="2.2" strokeOpacity="0.9" />
            <path d="M64 88 Q92 76 118 89 M94 83 Q108 96 126 94" strokeWidth="2.1" strokeOpacity="0.88" />
            <path d="M134 76 Q160 70 178 85 M146 74 Q155 89 168 91" strokeWidth="2" strokeOpacity="0.85" />
            <path d="M76 104 Q112 95 148 106 M54 94 Q72 91 86 100" strokeWidth="1.8" strokeOpacity="0.82" />
            <path d="M84 46 Q96 52 108 49 M152 58 Q166 54 176 64" strokeWidth="1.4" strokeOpacity="0.75" />
          </g>
          {/* Charred cast-iron diamond sear bars across the cut */}
          <g stroke="var(--sear)" strokeWidth="2.8" strokeOpacity="0.76">
            <path d="M62 24 L44 112 M92 20 L74 120 M122 20 L104 124 M152 26 L134 120 M180 40 L164 110" />
            <path d="M48 52 L144 120 M74 32 L174 104 M112 24 L192 84" strokeWidth="2" strokeOpacity="0.55" />
          </g>
          {/* Melting herb-garlic compound butter pool on the hot crust */}
          <ellipse cx="114" cy="82" rx="22" ry="13" fill="var(--fat)" fillOpacity="0.28" />
          <ellipse
            cx="114"
            cy="80"
            rx="14"
            ry="9.5"
            transform="rotate(-8 114 80)"
            fill={`url(#${prefix}-butter)`}
            stroke="var(--sear)"
            strokeWidth="1"
          />
          {/* Chive, cracked pepper & flaky sea-salt flecks */}
          <g fill="var(--sear)">
            <circle cx="110" cy="78" r="1.4" />
            <circle cx="118" cy="82" r="1.3" />
            <circle cx="114" cy="84" r="1" />
          </g>
          <g fill="var(--fat)" opacity="0.95">
            <polygon points="86,68 89,66 90,70" />
            <polygon points="142,88 145,86 146,90" />
            <polygon points="98,96 101,94 102,98" />
          </g>
        </g>
      );

    case 'strip':
      return (
        <g>
          <ellipse cx="116" cy="90" rx="92" ry="48" fill="var(--sear)" fillOpacity="0.45" />
          <path d="M24 76 L32 114 C64 128, 162 128, 194 114 L204 72 Z" fill={`url(#${prefix}-crust)`} />
          <path
            d="M30 46 C52 30, 168 28, 198 44 C208 58, 206 92, 190 106 C158 120, 60 120, 32 102 C20 88, 20 58, 30 46 Z"
            fill="var(--sear)"
            stroke={`url(#${prefix}-fat)`}
            strokeWidth="2.8"
          />
          <path d="M36 44 C74 32, 158 32, 192 46 C186 56, 68 56, 36 44 Z" fill={`url(#${prefix}-fat)`} />
          <path
            d="M36 54 C76 46, 156 46, 190 56 C196 72, 194 92, 180 100 C152 112, 64 112, 40 96 C28 84, 28 64, 36 54 Z"
            fill={`url(#${prefix}-meat)`}
          />
          <path
            d="M52 68 Q80 62 106 70 M114 66 Q146 60 174 70 M46 82 Q86 76 124 86 M130 82 Q158 76 180 86 M66 96 Q108 90 154 98"
            stroke="var(--fat)"
            strokeWidth="2.1"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M56 44 L44 102 M86 44 L74 106 M116 44 L104 108 M146 46 L134 106 M176 50 L164 102"
            stroke="var(--sear)"
            strokeWidth="2.7"
            strokeOpacity="0.74"
          />
        </g>
      );

    case 'fillet':
      return (
        <g>
          <ellipse cx="115" cy="96" rx="62" ry="34" fill="var(--sear)" fillOpacity="0.48" />
          <path
            d="M62 72 L62 106 C62 128, 168 128, 168 106 L168 72 Z"
            fill={`url(#${prefix}-crust)`}
            stroke="var(--fat)"
            strokeWidth="1.6"
          />
          <path
            d="M62 94 C92 110, 138 110, 168 94"
            stroke="var(--fat)"
            strokeWidth="2"
            strokeDasharray="5 3"
            fill="none"
          />
          <ellipse
            cx="115"
            cy="68"
            rx="53"
            ry="37"
            fill="var(--sear)"
            stroke={`url(#${prefix}-fat)`}
            strokeWidth="2.5"
          />
          <ellipse cx="115" cy="68" rx="46" ry="31" fill={`url(#${prefix}-meat)`} />
          <path
            d="M86 58 Q115 50 142 60 M82 72 Q115 64 146 74 M94 84 Q116 78 136 84"
            stroke="var(--fat)"
            strokeWidth="1.7"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M84 42 L142 92 M104 38 L154 80 M74 54 L122 94 M144 42 L86 92 M124 38 L74 80"
            stroke="var(--sear)"
            strokeWidth="2.4"
            strokeOpacity="0.68"
          />
          <ellipse cx="115" cy="66" rx="11" ry="7.5" fill={`url(#${prefix}-butter)`} stroke="var(--sear)" strokeWidth="1" />
        </g>
      );

    case 'porterhouse':
      return (
        <g>
          <ellipse cx="116" cy="92" rx="96" ry="52" fill="var(--sear)" fillOpacity="0.45" />
          <path
            d="M20 70 C18 104, 44 126, 114 134 L124 134 C158 132, 200 118, 206 80 Z"
            fill={`url(#${prefix}-crust)`}
          />
          <path
            d="M28 42 C56 20, 108 20, 122 30 C142 22, 188 28, 204 54 C214 78, 198 114, 164 122 C142 128, 128 120, 118 130 C108 120, 68 126, 42 112 C20 100, 14 62, 28 42 Z"
            fill="var(--sear)"
            stroke={`url(#${prefix}-fat)`}
            strokeWidth="3"
          />
          <path
            d="M36 48 C58 30, 98 30, 112 40 L112 108 C84 114, 52 108, 38 96 C26 84, 26 62, 36 48 Z"
            fill={`url(#${prefix}-meat)`}
          />
          <path
            d="M126 42 C148 34, 184 40, 194 58 C202 76, 190 104, 162 110 C146 114, 132 108, 126 104 Z"
            fill={`url(#${prefix}-eye)`}
          />
          <path
            d="M56 30 L178 34 L176 44 L125 43 L123 126 L111 126 L113 43 L56 40 Z"
            fill={`url(#${prefix}-fat)`}
            stroke="var(--sear)"
            strokeWidth="1.6"
          />
          <path
            d="M46 62 Q76 54 100 66 M48 82 Q78 74 102 86 M58 98 Q82 92 100 100 M138 62 Q162 56 180 68 M140 82 Q160 76 176 86"
            stroke="var(--fat)"
            strokeWidth="2.1"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M52 38 L42 100 M80 36 L70 108 M148 40 L138 106 M174 46 L164 104"
            stroke="var(--sear)"
            strokeWidth="2.5"
            strokeOpacity="0.7"
          />
        </g>
      );

    case 'flat-iron':
      return (
        <g>
          <path d="M24 90 L64 124 L182 116 L198 56 L178 106 L64 114 Z" fill={`url(#${prefix}-crust)`} />
          <path
            d="M32 62 L86 30 L198 44 L180 108 L64 116 L24 88 Z"
            fill="var(--sear)"
            stroke={`url(#${prefix}-fat)`}
            strokeWidth="2.8"
          />
          <path
            d="M40 64 L88 38 L188 50 L172 100 L68 108 L34 84 Z"
            fill={`url(#${prefix}-meat)`}
          />
          <path
            d="M56 62 L170 58 M52 76 L166 72 M62 90 L158 86 M84 50 L150 48"
            stroke="var(--fat)"
            strokeWidth="2.1"
            strokeLinecap="round"
          />
          <path
            d="M74 40 L62 106 M110 44 L98 104 M146 48 L134 102"
            stroke="var(--sear)"
            strokeWidth="2.6"
            strokeOpacity="0.72"
          />
        </g>
      );

    case 'short-rib':
      return (
        <g>
          <ellipse cx="115" cy="88" rx="94" ry="46" fill="var(--sear)" fillOpacity="0.45" />
          <path
            d="M14 62 C14 56, 216 56, 216 62 L216 88 C216 94, 14 94, 14 88 Z"
            fill={`url(#${prefix}-fat)`}
            stroke="var(--sear)"
            strokeWidth="2.2"
          />
          <ellipse cx="20" cy="75" rx="5.5" ry="9.5" fill="var(--sear)" opacity="0.55" />
          <ellipse cx="210" cy="75" rx="5.5" ry="9.5" fill="var(--sear)" opacity="0.55" />
          <rect
            x="50"
            y="28"
            width="130"
            height="94"
            rx="8"
            fill={`url(#${prefix}-crust)`}
            stroke={`url(#${prefix}-fat)`}
            strokeWidth="2.8"
          />
          <rect x="58" y="36" width="114" height="78" rx="4" fill={`url(#${prefix}-meat)`} />
          <path
            d="M62 54 C96 48, 136 58, 168 52 M62 74 C98 68, 136 78, 168 72 M62 94 C98 88, 136 96, 168 92"
            stroke="var(--fat)"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M84 36 L84 114 M115 36 L115 114 M146 36 L146 114"
            stroke="var(--sear)"
            strokeWidth="2.8"
            strokeOpacity="0.72"
          />
        </g>
      );

    case 'vegetable':
      return (
        <g>
          <ellipse cx="115" cy="84" rx="78" ry="50" fill={`url(#${prefix}-crust)`} stroke="var(--rule)" strokeWidth="2" />
          <path
            d="M50 104 C36 88, 42 54, 66 38 C86 22, 118 20, 146 28 C172 36, 190 60, 180 92 C174 112, 148 124, 114 124 C80 124, 60 116, 50 104 Z"
            fill="var(--sear)"
            stroke={`url(#${prefix}-fat)`}
            strokeWidth="2.5"
          />
          <circle cx="92" cy="60" r="24" fill={`url(#${prefix}-fat)`} stroke="var(--sear)" strokeWidth="2.2" />
          <circle cx="132" cy="62" r="26" fill={`url(#${prefix}-fat)`} stroke="var(--sear)" strokeWidth="2.2" />
          <circle cx="112" cy="86" r="26" fill={`url(#${prefix}-fat)`} stroke="var(--sear)" strokeWidth="2.2" />
          <circle cx="78" cy="88" r="19" fill={`url(#${prefix}-fat)`} stroke="var(--sear)" strokeWidth="2" />
          <circle cx="146" cy="90" r="19" fill={`url(#${prefix}-fat)`} stroke="var(--sear)" strokeWidth="2" />
          <path
            d="M80 52 Q96 44 106 56 M120 52 Q136 46 146 58 M98 80 Q114 72 126 84 M70 84 Q82 78 90 88"
            stroke="var(--ember)"
            strokeWidth="2.8"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      );
  }
}

/** Compact inline silhouette used in cut ledger entries. Hidden from AT when adjacent text carries the full data. */
export function CutSilhouette({
  art,
  title,
  className = 'h-16 w-28',
}: {
  art: IllustrationArt;
  title?: string;
  className?: string;
}) {
  const prefix = `sil-${art}`;
  return (
    <svg
      viewBox="0 0 230 150"
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <CutArtDefs prefix={prefix} />
      <g stroke="var(--rule)" strokeWidth="2" strokeOpacity="0.55">
        <line x1="38" y1="8" x2="38" y2="142" />
        <line x1="76" y1="8" x2="76" y2="142" />
        <line x1="115" y1="8" x2="115" y2="142" />
        <line x1="154" y1="8" x2="154" y2="142" />
        <line x1="192" y1="8" x2="192" y2="142" />
      </g>
      {renderCutShape(art, prefix)}
    </svg>
  );
}

/**
 * Oversized Hero Cut Ledger centrepiece: dark cast-iron firebox & grate over glowing white-oak coals,
 * top-down cut silhouette with roasted garlic, rosemary & cellar glass, and leader lines to live specs.
 */
export function HeroCutDiagram({
  item,
  pairing,
}: {
  item: MenuItem;
  pairing?: Pairing;
}) {
  const cut = item.cut;
  const art: IllustrationArt = cut?.art ?? 'ribeye';
  const weightLabel = cut ? `${cut.weightOz} OZ PRE-COOKED` : 'HOUSE CUT';
  const specLabel = cut
    ? `${cut.boneIn ? 'BONE-IN' : 'BONELESS'} · ${cut.marbling.toUpperCase()} MARBLING`
    : 'COAL-ROASTED';
  const priceLabel = typeof item.price === 'number' ? formatPrice(item.price) : '';

  return (
    <svg
      viewBox="0 0 640 272"
      className="h-auto w-full"
      role="img"
      aria-label={`${item.name} over white-oak coals: ${weightLabel.toLowerCase()}, ${specLabel.toLowerCase()}`}
    >
      <title>{`${item.name} — ${weightLabel}, ${specLabel}`}</title>
      <CutArtDefs prefix="hero" />
      <defs>
        {/* Warm white-oak ember bed glow radiating from beneath the steak */}
        <radialGradient id="emberBedGlow" cx="50%" cy="54%" r="44%">
          <stop offset="0%" stopColor="var(--ember)" stopOpacity="0.42" />
          <stop offset="48%" stopColor="var(--accent)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="var(--surface)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ambient white-oak ember bed glow beneath the grill grate (unboxed, open on the ledger) */}
      <ellipse cx="320" cy="138" rx="250" ry="112" fill="url(#emberBedGlow)" />

      {/* Top and bottom butcher's scale rules */}
      <line x1="8" y1="6" x2="632" y2="6" stroke="var(--rule)" strokeWidth="1" strokeOpacity="0.65" />
      <line x1="8" y1="266" x2="632" y2="266" stroke="var(--rule)" strokeWidth="1" strokeOpacity="0.65" />

      {/* Heavy parallel cast-iron grill bars functioning as vertical ledger rules */}
      <g>
        {[176, 224, 272, 320, 368, 416, 464].map(x => (
          <g key={x}>
            <line x1={x} y1="6" x2={x} y2="266" stroke="var(--rule)" strokeWidth="2.5" strokeOpacity="0.5" />
            <line x1={x + 1.5} y1="26" x2={x + 1.5} y2="246" stroke="var(--sear)" strokeWidth="1.2" strokeOpacity="0.38" />
          </g>
        ))}
      </g>

      {/* Smouldering faceted white-oak coals beneath the grate */}
      <g className="ember-glow">
        <polygon points="168,198 196,186 206,204 176,214" fill="var(--ember)" opacity="0.82" />
        <polygon points="176,196 192,190 198,200 180,206" fill="var(--fat)" opacity="0.5" />
        <polygon points="242,210 276,198 286,216 250,224" fill="var(--accent)" opacity="0.85" />
        <polygon points="252,208 272,202 277,212 256,216" fill="var(--ember)" opacity="0.8" />
        <polygon points="364,202 398,190 406,210 372,218" fill="var(--ember)" opacity="0.82" />
        <polygon points="424,178 450,168 458,186 432,194" fill="var(--accent)" opacity="0.76" />
        <polygon points="218,46 242,38 250,52 224,58" fill="var(--ember)" opacity="0.68" />
        <polygon points="384,42 410,34 418,48 390,54" fill="var(--ember)" opacity="0.65" />
        {/* Floating ember sparks */}
        <circle cx="212" cy="166" r="2.2" fill="var(--ember)" />
        <circle cx="418" cy="154" r="2" fill="var(--ember)" />
        <circle cx="314" cy="222" r="2.2" fill="var(--accent)" />
        <circle cx="272" cy="62" r="1.8" fill="var(--ember)" />
      </g>

      {/* Halved head of char-roasted garlic on the grate (bottom-left of steak) */}
      <g transform="translate(120, 148)">
        <circle cx="26" cy="26" r="22" fill="var(--sear)" stroke="var(--fat)" strokeWidth="2" />
        <ellipse cx="19" cy="19" rx="6.5" ry="4.5" transform="rotate(-28 19 19)" fill="var(--fat)" />
        <ellipse cx="32" cy="18" rx="6.5" ry="4.5" transform="rotate(28 32 18)" fill="var(--fat)" />
        <ellipse cx="17" cy="31" rx="6.5" ry="4.5" transform="rotate(22 17 31)" fill="var(--fat)" />
        <ellipse cx="33" cy="31" rx="6.5" ry="4.5" transform="rotate(-22 33 31)" fill="var(--fat)" />
        <ellipse cx="26" cy="35" rx="5" ry="3.5" fill="var(--fat)" />
        <circle cx="26" cy="25" r="2.8" fill="var(--ember)" />
      </g>

      {/* Blistered rosemary sprig across the right grill bars */}
      <g stroke="var(--sear)" strokeWidth="2.4" strokeLinecap="round" opacity="0.85">
        <path d="M448 164 Q484 136 514 98" fill="none" />
        <line x1="460" y1="154" x2="450" y2="142" />
        <line x1="460" y1="154" x2="474" y2="156" />
        <line x1="476" y1="138" x2="466" y2="124" />
        <line x1="476" y1="138" x2="490" y2="140" />
        <line x1="492" y1="122" x2="482" y2="108" />
        <line x1="492" y1="122" x2="506" y2="124" />
        <line x1="506" y1="106" x2="498" y2="94" />
      </g>

      {/* Oversized centered top-down cut silhouette sizzling on the grate */}
      <g transform="translate(154, 22) scale(1.48)">
        {renderCutShape(art, 'hero')}
      </g>

      {/* Rising aromatic heat wisps */}
      <g stroke="var(--ember)" strokeWidth="1.5" strokeOpacity="0.45" fill="none" strokeLinecap="round">
        <path d="M278 66 C268 46, 286 32, 276 14" />
        <path d="M346 60 C356 42, 338 28, 348 12" />
      </g>

      {/* Architectural Leader Line 1: Cut Name & Marbling (Top-Left) */}
      <g>
        <polygon points="248,90 253,95 248,100 243,95" fill="var(--ember)" />
        <polyline
          points="248,95 196,42 14,42"
          fill="none"
          stroke="var(--ember)"
          strokeWidth="1.7"
        />
        <text
          x="14"
          y="33"
          fill="var(--text)"
          fontFamily="var(--font-display)"
          fontSize="15.5"
          fontWeight="700"
          letterSpacing="1.5"
        >
          {item.name.toUpperCase()} · {priceLabel}
        </text>
        <text
          x="14"
          y="58"
          fill="var(--muted)"
          fontFamily="var(--font-sans)"
          fontSize="11.5"
          fontWeight="600"
        >
          {specLabel}
        </text>
      </g>

      {/* Architectural Leader Line 2: Live Weight & Portion (Top-Right) */}
      <g>
        <polygon points="396,98 401,103 396,108 391,103" fill="var(--ember)" />
        <polyline
          points="396,103 444,44 626,44"
          fill="none"
          stroke="var(--ember)"
          strokeWidth="1.7"
        />
        <text
          x="626"
          y="33"
          textAnchor="end"
          fill="var(--ember)"
          fontFamily="var(--font-display)"
          fontSize="16"
          fontWeight="700"
          letterSpacing="1.4"
        >
          {weightLabel}
        </text>
        <text
          x="626"
          y="59"
          textAnchor="end"
          fill="var(--muted)"
          fontFamily="var(--font-sans)"
          fontSize="11.5"
          fontWeight="600"
        >
          {cut ? `SERVES ${cut.serves} · RESTED & CARVED` : 'SINGLE PORTION'}
        </text>
      </g>

      {/* Architectural Leader Line 3: Cellar Pairing (Bottom-Right) */}
      <g>
        <polygon points="366,172 371,177 366,182 361,177" fill="var(--wine)" />
        <polyline
          points="366,177 416,226 626,226"
          fill="none"
          stroke="var(--wine)"
          strokeWidth="1.7"
        />
        <text
          x="626"
          y="217"
          textAnchor="end"
          fill="var(--wine)"
          fontFamily="var(--font-display)"
          fontSize="14"
          fontWeight="700"
          letterSpacing="1.4"
        >
          CELLAR: {(pairing?.name ?? 'HOUSE PAIRING').toUpperCase()}
        </text>
        <text
          x="626"
          y="243"
          textAnchor="end"
          fill="var(--muted)"
          fontFamily="var(--font-sans)"
          fontSize="11"
        >
          LEDGER REF #{item.id.toUpperCase()}
        </text>
      </g>

      {/* Bottom-left hearth stamp */}
      <text
        x="14"
        y="244"
        fill="var(--muted)"
        fontFamily="var(--font-display)"
        fontSize="11.5"
        letterSpacing="1.8"
      >
        WHITE-OAK COALS · CAST-IRON GRATE
      </text>
    </svg>
  );
}

/**
 * Carved steak slice cross-section swatch for the five-step doneness guide.
 * Shows organic steak slice contours, seared crust, flaky salt and progressive core bands.
 */
export function DonenessSwatch({ level }: { level: DonenessId }) {
  const searBand =
    level === 'rare' ? 3 : level === 'medium-rare' ? 5.5 : level === 'medium' ? 8.5 : level === 'medium-well' ? 12 : 18;
  const centerFill =
    level === 'rare'
      ? 'var(--accent)'
      : level === 'medium-rare'
        ? 'var(--ember)'
        : level === 'medium'
          ? 'var(--wine)'
          : level === 'medium-well'
            ? 'var(--fat)'
            : 'var(--sear)';

  return (
    <svg aria-hidden="true" viewBox="0 0 132 52" className="h-12 w-32 shrink-0">
      <path
        d="M10 14 C24 7, 108 7, 122 14 C128 22, 128 34, 120 42 C104 47, 28 47, 12 42 C4 34, 4 22, 10 14 Z"
        fill="var(--sear)"
        stroke="var(--fat)"
        strokeWidth="1.5"
      />
      <path
        d="M15 17 C28 11, 104 11, 117 17 C122 23, 122 33, 115 39 C100 43, 32 43, 17 39 C10 33, 10 23, 15 17 Z"
        fill="var(--surface-raised)"
      />
      {level !== 'well-done' ? (
        <rect
          x="18"
          y={10 + searBand}
          width="96"
          height={Math.max(4, 34 - searBand * 2)}
          rx="5"
          fill={centerFill}
        />
      ) : null}
      <g stroke="var(--bg)" strokeWidth="1.2" strokeOpacity="0.42">
        <line x1="30" y1="13" x2="25" y2="41" />
        <line x1="50" y1="12" x2="45" y2="42" />
        <line x1="70" y1="12" x2="65" y2="42" />
        <line x1="90" y1="12" x2="85" y2="42" />
        <line x1="108" y1="14" x2="103" y2="40" />
      </g>
      <g fill="var(--fat)">
        <polygon points="38,8 41,6 43,9" />
        <polygon points="66,7 69,5 71,8" />
        <polygon points="92,8 95,6 97,9" />
      </g>
    </svg>
  );
}
