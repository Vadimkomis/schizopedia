/**
 * Anatomical lateral (side-profile) view of a human brain: the folded cortex
 * with its major sulci, the Sylvian fissure separating the temporal lobe, the
 * cerebellum with its fine folia, and the brain stem. Purely decorative; it
 * inherits its colour from the surrounding text colour so it adapts to theme.
 */
export function BrainIllustration() {
  return (
    <div className="relative mx-auto flex h-[320px] w-full max-w-[480px] items-center justify-center lg:h-[380px]">
      <div
        className="absolute inset-0 brain-glow blur-2xl opacity-80"
        aria-hidden="true"
      />
      <svg
        viewBox="0 0 400 300"
        aria-hidden="true"
        className="relative h-full w-auto max-w-full text-brand-500 drop-shadow-[0_8px_30px_rgba(59,130,246,0.35)] dark:text-brand-300"
      >
        <defs>
          <clipPath id="brain-cerebrum-clip">
            <path d={CEREBRUM} />
          </clipPath>
          <clipPath id="brain-cerebellum-clip">
            <path d={CEREBELLUM} />
          </clipPath>
        </defs>

        {/* Brain stem, drawn first so the cortex overlaps its top */}
        <path
          d={BRAIN_STEM}
          fill="currentColor"
          fillOpacity="0.1"
          stroke="currentColor"
          strokeOpacity="0.85"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />

        {/* Cerebellum body + folia */}
        <path
          d={CEREBELLUM}
          fill="currentColor"
          fillOpacity="0.14"
          stroke="currentColor"
          strokeOpacity="0.85"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
        <g
          clipPath="url(#brain-cerebellum-clip)"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.4"
          strokeWidth="1.3"
          strokeLinecap="round"
        >
          {CEREBELLUM_FOLIA.map((d, i) => (
            <path key={`folia-${i}`} d={d} />
          ))}
        </g>

        {/* Cerebrum body */}
        <path
          d={CEREBRUM}
          fill="currentColor"
          fillOpacity="0.1"
          stroke="currentColor"
          strokeOpacity="0.9"
          strokeWidth="2.6"
          strokeLinejoin="round"
        />

        {/* Cortical folds (sulci), clipped to the cerebrum so they stay inside */}
        <g
          clipPath="url(#brain-cerebrum-clip)"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
        >
          {SULCI.map((d, i) => (
            <path key={`sulcus-${i}`} d={d} strokeOpacity="0.45" strokeWidth="1.7" />
          ))}
          {/* Sylvian fissure + central sulcus, drawn heavier as key landmarks */}
          <path d={SYLVIAN_FISSURE} strokeOpacity="0.7" strokeWidth="2.4" />
          <path d={CENTRAL_SULCUS} strokeOpacity="0.62" strokeWidth="2.1" />
        </g>
      </svg>
    </div>
  );
}

// Lateral cerebrum silhouette, frontal lobe facing left (viewBox 0 0 400 300).
// The top edge is deliberately scalloped so the gyri bulge at the outline.
const CEREBRUM = `
  M 52 150
  C 46 120, 52 96, 70 80
  C 78 72, 90 74, 96 82
  C 104 70, 118 68, 128 76
  C 138 66, 152 66, 160 74
  C 172 62, 188 64, 196 72
  C 210 62, 226 66, 234 76
  C 250 68, 270 76, 286 92
  C 308 110, 340 127, 337 157
  C 334 178, 322 190, 301 194
  C 293 196, 287 195, 282 191
  C 273 200, 258 206, 240 208
  C 208 213, 170 214, 138 210
  C 116 207, 98 202, 86 192
  C 74 183, 66 170, 60 160
  C 57 155, 54 153, 52 150 Z
`;

// Cerebellum: rounded mass tucked under the occipital lobe, back-bottom.
const CEREBELLUM = `
  M 286 195
  C 298 187, 324 186, 341 198
  C 355 207, 356 230, 342 242
  C 328 253, 301 254, 288 242
  C 278 234, 276 205, 286 195 Z
`;

// Brain stem descending from between temporal lobe and cerebellum.
const BRAIN_STEM = `
  M 264 195
  C 261 216, 263 236, 271 250
  C 275 256, 281 256, 284 250
  C 281 235, 280 214, 278 196
  C 273 199, 268 199, 264 195 Z
`;

const CEREBELLUM_FOLIA = [
  "M 290 204 C 308 198, 330 200, 345 209",
  "M 287 213 C 307 207, 331 209, 347 218",
  "M 286 223 C 307 218, 331 220, 346 228",
  "M 289 232 C 309 228, 330 230, 343 236",
  "M 296 240 C 313 238, 329 240, 339 244",
];

// Long horizontal fissure separating the temporal lobe from the rest.
const SYLVIAN_FISSURE =
  "M 74 158 C 112 176, 168 184, 226 177 C 246 174, 262 168, 272 160";

// Central sulcus running down from the vertex.
const CENTRAL_SULCUS = "M 200 62 C 197 90, 192 118, 182 148";

const SULCI = [
  // Frontal lobe folds
  "M 72 92 C 92 84, 112 96, 132 88 C 146 83, 156 88, 164 92",
  "M 70 110 C 92 102, 114 114, 136 106 C 150 101, 160 106, 168 110",
  "M 74 128 C 94 122, 114 132, 134 126",
  // Parietal folds
  "M 168 80 C 196 72, 224 84, 252 76 C 276 70, 296 82, 312 96",
  "M 176 98 C 204 90, 232 102, 260 94 C 284 88, 302 100, 316 114",
  "M 184 118 C 210 110, 238 120, 264 114 C 288 109, 304 120, 316 132",
  // Precentral / postcentral gyri, either side of the central sulcus
  "M 176 66 C 173 92, 170 118, 162 148",
  "M 226 66 C 224 92, 222 118, 216 150",
  // Occipital (back) folds
  "M 296 96 C 312 112, 320 132, 315 154",
  "M 284 128 C 300 138, 310 154, 312 172",
  // Frontal pole + short connecting folds
  "M 86 148 C 76 134, 76 114, 86 98",
  "M 150 110 C 158 120, 156 132, 148 140",
  "M 230 100 C 238 110, 238 124, 230 134",
  "M 120 150 C 132 156, 146 154, 158 158",
  // Temporal lobe folds (below the Sylvian fissure)
  "M 92 182 C 124 192, 162 186, 198 192 C 230 197, 256 191, 276 186",
  "M 108 197 C 138 204, 174 200, 206 203 C 230 205, 250 202, 266 199",
];
