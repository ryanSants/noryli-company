<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->
- Quote requests insert directly from the browser into `leads` (anon insert-only RLS, unique `request_id` for double-tap dedupe); admins read/update via `has_role`. Why: visitors never need read access, so no server function is required.
- The admin role is granted by a signup trigger for the Noryli business email. Why: avoids a manual role-assignment step.
