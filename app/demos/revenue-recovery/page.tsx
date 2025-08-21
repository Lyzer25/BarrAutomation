import React from "react";
import RecoveryDemoClientWrapper from "@/components/recovery-demo/client-wrapper";

export default function RevenueRecoveryDemoPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-6 text-center">
        <h1 className="font-mono text-3xl text-white font-bold">Revenue Recovery Robot — Live Demo (Sandbox)</h1>
        <p className="text-subtle-gray mt-2 max-w-2xl mx-auto">
          Interactive, simulated demo showing abandoned-cart detection and AI-driven re-activation. Demo only — no
          real stores or messages are used.
        </p>
      </header>

      <main>
        <RecoveryDemoClientWrapper />
      </main>
    </div>
  );
}
