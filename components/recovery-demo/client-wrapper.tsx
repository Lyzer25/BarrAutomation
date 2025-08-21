"use client";

import React from "react";
import RecoveryDemo from "./dashboard";

/**
 * RecoveryDemoClientWrapper
 * - Client wrapper that renders the client-only RecoveryDemo component.
 * - We keep this wrapper tiny so app/demos/revenue-recovery/page.tsx can remain a Server Component
 *   while delegating all client-side UI to this component (avoids next/dynamic { ssr: false } in a server file).
 *
 * Note: dashboard.tsx already begins with "use client" so it's safe to import here.
 */

export default function RecoveryDemoClientWrapper() {
  return <RecoveryDemo />;
}
