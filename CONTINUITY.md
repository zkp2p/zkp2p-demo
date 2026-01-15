Goal (incl. success criteria):
- Use the installed `@zkp2p/sdk` extension wrapper in zkp2p-demo instead of `window.peer`, with no Vite config changes.

Constraints/Assumptions:
- No network access; workspace-write sandbox.
- `@zkp2p/sdk` is already installed.

Key decisions:
- Revert the Vite fs allowlist change and import from `@zkp2p/sdk`.

State:
- Awaiting confirmation.

Done:
- Replaced `window.peer` calls with `peerExtensionSdk` in `src/App.tsx`.
- Swapped query-string builder for `PeerExtensionOnrampParams` object usage.
- Reverted Vite fs allowlist change.
- Switched SDK imports to `@zkp2p/sdk`.

Now:
- Await user review.

Next:
- Optional: run dev/typecheck to confirm build with installed SDK.

Open questions (UNCONFIRMED if needed):
- None.

Working set (files/ids/commands):
- `src/App.tsx`
- `vite.config.ts`
- `CONTINUITY.md`
