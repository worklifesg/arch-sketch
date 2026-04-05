/**
 * Re-exports provider shape catalogs for reference.
 * The actual shape data lives in system.ts — this module provides
 * helpers for prompt construction.
 */

export const SUPPORTED_PROVIDERS = [
  "aws",
  "azure",
  "gcp",
  "kubernetes",
  "general",
] as const;

export type Provider = (typeof SUPPORTED_PROVIDERS)[number];

export function isValidProvider(value: string): value is Provider {
  return SUPPORTED_PROVIDERS.includes(value as Provider);
}

export function getProviderDisplayName(provider: Provider): string {
  const names: Record<Provider, string> = {
    aws: "Amazon Web Services",
    azure: "Microsoft Azure",
    gcp: "Google Cloud Platform",
    kubernetes: "Kubernetes",
    general: "General Architecture",
  };
  return names[provider];
}
