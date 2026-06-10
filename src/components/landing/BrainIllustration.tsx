/**
 * Anatomical side-profile brain rendered as a neural network — outline,
 * gyri folds, synapse nodes, and connecting fibers. Purely decorative.
 */
export function BrainIllustration() {
  return (
    <div className="relative mx-auto flex h-[320px] w-full max-w-[480px] items-center justify-center lg:h-[380px]">
      <div
        className="absolute inset-0 brain-glow blur-2xl opacity-80"
        aria-hidden="true"
      />
      <svg
        viewBox="0 0 320 280"
        aria-hidden="true"
        className="relative h-full w-auto text-brand-500 drop-shadow-[0_8px_30px_rgba(59,130,246,0.35)] dark:text-brand-300"
      >
        {/* Outer cortex profile (facing right) */}
        <path
          d="M158 28
             C 120 18, 84 30, 66 56
             C 44 64, 32 86, 36 110
             C 22 124, 20 150, 32 168
             C 30 192, 44 212, 68 220
             C 76 240, 100 250, 122 244
             C 132 258, 156 262, 172 252
             C 186 262, 210 258, 220 244
             C 246 246, 268 230, 272 206
             C 292 192, 298 164, 286 144
             C 296 120, 288 94, 266 82
             C 262 56, 238 38, 212 42
             C 198 26, 174 22, 158 28 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          className="opacity-80"
        />
        {/* Gyri — inner folds */}
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="opacity-45"
        >
          <path d="M70 64 C 92 52, 118 50, 138 60 C 154 48, 180 46, 198 56" />
          <path d="M48 104 C 66 90, 92 88, 108 100 C 126 86, 152 88, 166 102" />
          <path d="M44 152 C 64 138, 90 140, 104 154 C 124 142, 148 146, 160 160" />
          <path d="M70 200 C 92 188, 116 190, 132 204 C 150 192, 174 194, 188 208" />
          <path d="M196 84 C 216 74, 240 78, 252 94" />
          <path d="M204 130 C 224 118, 250 122, 262 140" />
          <path d="M206 176 C 226 166, 248 170, 258 186" />
          {/* Cerebellum hatch */}
          <path d="M196 224 C 206 216, 220 214, 232 220" />
          <path d="M198 236 C 210 228, 226 226, 238 232" />
        </g>
        {/* Synapse fibers */}
        <g
          stroke="currentColor"
          strokeWidth="1.5"
          className="opacity-50"
        >
          <line x1="96" y1="80" x2="148" y2="118" />
          <line x1="148" y1="118" x2="214" y2="100" />
          <line x1="148" y1="118" x2="120" y2="176" />
          <line x1="120" y1="176" x2="190" y2="190" />
          <line x1="190" y1="190" x2="236" y2="156" />
          <line x1="214" y1="100" x2="236" y2="156" />
          <line x1="96" y1="80" x2="64" y2="136" />
          <line x1="64" y1="136" x2="120" y2="176" />
        </g>
        {/* Synapse nodes */}
        <g fill="currentColor">
          {[
            [96, 80, 5],
            [148, 118, 6],
            [214, 100, 5],
            [120, 176, 5],
            [190, 190, 6],
            [236, 156, 5],
            [64, 136, 4],
          ].map(([cx, cy, r]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} className="opacity-90">
              <animate
                attributeName="opacity"
                values="0.5;1;0.5"
                dur="3s"
                begin={`${(cx + cy) % 17 / 10}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
        </g>
      </svg>
    </div>
  );
}
