# Security Specifications (Zero-Trust ABAC Security Design)

This document establishes the security specifications, data invariants, and defensive design schemas for the Firestore collection schemas of the Programming Logic Game.

---

## 1. Data Invariants

1. **User Profiles (`/users/{uid}`)**
   - A user profile can only be created or modified by the authenticated user whose `request.auth.uid` matches the `{uid}` path parameter.
   - Profile emails and timestamps are immutable after creation, or must match server-authenticated attributes.

2. **Game Sessions (`/gameSessions/{sessionId}`)**
   - Any game session document must reference the creator's user UID in its `uid` field, which must match `request.auth.uid`.
   - Complete session ratings, score logs, and percentages must be typed correctly (e.g. `totalScore` is a number).

3. **Leaderboard (`/leaderboard/{uid}`)**
   - Only the authenticated owner can create/update their leaderboard record at `/leaderboard/{uid}`, where `{uid}` must match `request.auth.uid`.
   - The aggregate leaderboard must be read-accessible to any signed-in student, but writes to other users' records are strictly rejected.

---

## 2. The "Dirty Dozen" Payloads (Attacks designed to break laws of Identity, Integrity, and State)

1. **Identity Spoofing on User Profile Registration**: A logged-in attacker (`attacker_uid`) tries to write or hijack a user profile at `/users/victim_uid`.
2. **Ghost Field Poisoning on Profile**: Attacker tries to inject an unapproved admin field (`isAdmin: true`) or shadow configuration into `/users/attacker_uid`.
3. **Privilege Escalation during Registration**: Attacker sets `role: "admin"` in their own profile creation.
4. **Session Hijacking**: Attacker tries to write a game session under `/gameSessions/fake_session` setting `uid` to `victim_uid`.
5. **Score Manipulation / Value Poisoning**: Attacker sends a finished session payload setting a float/string or 1,000,000 extreme score to hijack leaderboards.
6. **Self-Rating Hack**: Attacker sets `percentage: 9999` in `gameSessions` to bypass normal calculations.
7. **Client Time-Spoofing**: Attacker sends client-generated historic timestamps (`createdAt` or `completedAt` as a hardcoded date in the past) instead of the mandatory Firestore server timestamp.
8. **Orphaned Session**: Attempt to create a game session containing an invalid/non-existent user UID references.
9. **Leaderboard Tampering**: Attacker tries to modify `highestScore` or increments `totalGames` on a victim's leaderboard document at `/leaderboard/victim_id`.
10. **Unauthenticated Read Spam**: Trying to scan all users' complete profiles or emails without authentication.
11. **Session Scraping**: Trying to query someone else's historic game sessions.
12. **Id Poisoning (Denial of Wallet)**: Injecting a 2MB string as a Document ID or inside dynamic lists to exhaust memory and query resources.

---

## 3. Security Rules Outline (`firestore.rules`)

I will enforce these constraints in `firestore.rules` using:
- **`request.auth != null`**: Gatekeepers for unauthorized calls.
- **`request.auth.uid == userId`**: Identity constraints.
- **`request.resource.data`**: Rigorous data structures and key size assertions via helper functions.
- **`request.time`**: Strict server-side timestamps.
