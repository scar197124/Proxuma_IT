# Proxuma IT v3.19.5 — Message Trigger Label Tuning

This patch preserves the v3.19.4 compact-plus public UI and offline engine boundary while tuning the dominant explanation lane for suspicious pasted message text.

## Changes

- Keeps the same high-risk detection for account-suspension/password/OTP scam text.
- Routes pure credential/OTP account-pressure messages toward MFA / OTP Code Theft, Credential Theft, Account Recovery, or Urgency labels instead of money/payment-rail wording.
- Adds token-aware payment matching so short words such as `pay` do not trigger inside unrelated words like `password`.
- Keeps money movement/payment rail routing for true Interac, e-transfer, bank-transfer, deposit, recipient, refund, payment, and transfer lures.
- No UI redesign, no API calls, no telemetry, no hidden online lookup.

## Validation sample

Input: `Your account will be suspended. Verify your password and OTP now.`

Expected: High Risk, 100/100, primary lane: MFA / OTP or credential/account takeover wording.
