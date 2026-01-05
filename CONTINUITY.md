Goal (incl. success criteria):
- Update PeerAuth flow to use `checkConnectionStatus` (poll until connected), adjust button text/behavior, remove extension status section, and tighten layout to fit on one page without pushing CTA offscreen.

Constraints/Assumptions:
- Use `frontend-design` skill guidance.
- `window.peer.requestConnection()` returns `Promise<boolean>` and `checkConnectionStatus()` returns a string (values UNCONFIRMED).
- No network access; workspace-write sandbox.

Key decisions:
- Poll `checkConnectionStatus` on an interval and during connect flow; treat common "disconnected" strings as not connected.
- Remove the PeerAuth extension status badge section; surface state via the CTA button.
- Reduce vertical spacing and increase form grid columns on wide screens to fit one page.

State:
- In progress.

Done:
- Reviewed `src/App.tsx` and UI components; loaded `frontend-design` skill.
- Updated `src/App.tsx` to poll `checkConnectionStatus`, use it in the connect flow, remove the extension status badge, and tighten layout spacing/width.

Now:
- Await user review; adjust connection status parsing if needed.

Next:
- Confirm `checkConnectionStatus` return values; tweak `isConnectedStatus` mapping if needed.

Open questions (UNCONFIRMED if needed):
- Exact strings returned by `checkConnectionStatus`.

Working set (files/ids/commands):
- `src/App.tsx`
- `CONTINUITY.md`
