# 04 — Mobile OS & Application Troubleshooting

**Domain:** 3.0 Software Troubleshooting (23%)
**Maps to objectives:** 3.3 (mobile OS issues), 3.4 (mobile security issues)

## Common mobile OS symptoms

| Symptom | Likely cause | Fix |
|---|---|---|
| **Poor battery life** | Background app refresh, screen brightness, poor signal (constant radio searching), aging battery | Check battery usage breakdown by app, reduce brightness, enable battery saver, check for a specific runaway app |
| **Device won't power on** | Battery fully drained, charging port/cable issue, hardware failure | Try a different cable/charger, force restart, professional diagnosis if persistent |
| **App won't launch/crashes immediately** | Corrupted cache, incompatible OS version, insufficient storage | Clear app cache/data (Android), reinstall app, check for pending OS update |
| **Device overheating** | Heavy background processing, direct sunlight, charging while in heavy use, failing battery | Close unused apps, avoid charging + gaming simultaneously, check for malware (cryptomining) |
| **Unresponsive touchscreen** | Software freeze, screen protector/case interference, digitizer hardware failure | Force restart first (software), then check hardware if it persists |
| **No sound / audio issues** | Volume/mute toggle, Bluetooth device still connected elsewhere, software glitch | Check physical mute switch, Bluetooth connections, restart |
| **GPS/location not working** | Location services disabled, poor signal, app permission not granted | Check location services toggle and per-app permission |
| **Slow data speeds** | Weak signal, network congestion, data throttling after cap exceeded, background updates consuming bandwidth | Check signal strength, check carrier data usage/throttle status |

## Connectivity-specific symptoms

| Symptom | Fix approach |
|---|---|
| Won't connect to Wi-Fi | Forget network and re-add, check password, restart router, check for a MAC filter blocking the device |
| Bluetooth pairing fails | Remove/re-pair the device, ensure both devices are in pairing/discoverable mode, check distance |
| No cellular signal | Check for airplane mode, toggle cellular, check carrier outage, reseat SIM card |
| Hotspot not visible to other devices | Check hotspot is actually enabled, check device connection limit isn't maxed out |

## App-specific troubleshooting steps (general order)

1. Force close and reopen the app
2. Check for app updates in the store
3. Clear app cache (Android: Settings > Apps > [app] > Storage > Clear Cache) — clearing **data** is more destructive (resets app to fresh install state), try cache first
4. Check app permissions haven't been revoked
5. Restart the device
6. Uninstall/reinstall as a last resort (confirm data sync/backup first if the app stores anything locally-only)

## Security-related mobile symptoms (ties to Phase 2's mobile security file)

| Symptom | What it suggests |
|---|---|
| Unexpected data usage spike | Malware exfiltrating data, or a misbehaving app syncing excessively |
| Unfamiliar apps appearing | Sideloaded malware, or another user/child installed something |
| Device unusually slow + hot + draining fast simultaneously | Classic cryptomining malware signature |
| Pop-up ads even when no browser is open | Adware embedded in an installed app, not just a browser issue |
| Unauthorized purchases/subscriptions appearing | Compromised store account or accidental in-app purchase — check account activity |

## Quick self-check
1. What's the difference between clearing an app's cache vs clearing its data, and which should you try first?
2. What mobile symptom combination is the classic signature of cryptomining malware?
3. A device won't connect to Wi-Fi it previously connected to fine — what's the first troubleshooting step to try?
4. Why should you check carrier data usage/throttle status before assuming a hardware/software fault for slow data speeds?

<details>
<summary>Answers</summary>

1. Cache = temporary files, safe to clear and try first; Data = resets the app to a fresh-install state (loses local settings/login), more destructive — try cache first.
2. Device is unusually hot, slow, and draining battery fast all at once with no obvious explanation.
3. Forget the network and re-add it (re-enter credentials) — often resolves a stale/corrupted saved network profile.
4. Because carriers throttle speeds after a data cap is exceeded — that's a simple, non-technical explanation that should be ruled out before deeper troubleshooting.
</details>
