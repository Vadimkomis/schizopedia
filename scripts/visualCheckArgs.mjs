const DEFAULT_BASE_URL = "http://localhost:5173";

export function resolveVisualCheckBaseUrl(args) {
  return args.find((argument) => argument !== "--") ?? DEFAULT_BASE_URL;
}
