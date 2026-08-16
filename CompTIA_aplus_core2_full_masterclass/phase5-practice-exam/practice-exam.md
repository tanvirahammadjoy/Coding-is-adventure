# CompTIA A+ Core 2 (220-1202) — Full Practice Exam

60 questions, weighted to match the real exam's domain distribution:
- Operating Systems (28%) — Q1–17
- Security (28%) — Q18–34
- Software Troubleshooting (23%) — Q35–48
- Operational Procedures (21%) — Q49–60

Answers and explanations are in `answer-key.md`. Try to complete this in one sitting (~75–90 minutes, matching real exam pacing) before checking answers.

---

## Domain 1: Operating Systems

**Q1.** A user needs to move a 12GB video file between a Windows PC and a MacBook using a USB flash drive. Which filesystem should the drive be formatted with?
A) NTFS  B) FAT32  C) exFAT  D) ext4

**Q2.** Which Windows edition is the minimum required to join an Active Directory domain?
A) Home  B) Pro  C) Enterprise only  D) Education only

**Q3.** A technician needs to enable BitLocker on a laptop but the option doesn't appear in Control Panel. What's the most likely cause?
A) TPM is disabled in BIOS  B) The laptop is running Windows Home  C) The drive is formatted FAT32  D) UAC is disabled

**Q4.** Which partition table type is required to boot in UEFI mode with Secure Boot enabled?
A) MBR  B) GPT  C) exFAT  D) APFS

**Q5.** What is the primary risk of running Disk Defragmenter on an SSD?
A) Data loss  B) Unnecessary write cycles that reduce drive lifespan  C) It will corrupt the partition table  D) It voids the warranty

**Q6.** Which command verifies and repairs protected Windows system files?
A) `chkdsk /f`  B) `diskpart`  C) `sfc /scannow`  D) `gpupdate /force`

**Q7.** A technician wants to see which process owns a suspicious active network connection along with its PID. Which command accomplishes this?
A) `ipconfig /all`  B) `netstat -abo`  C) `tracert`  D) `nslookup`

**Q8.** In the Windows Registry, which hive contains settings specific to the currently logged-in user?
A) HKEY_LOCAL_MACHINE  B) HKEY_CLASSES_ROOT  C) HKEY_CURRENT_USER  D) HKEY_USERS

**Q9.** What is the macOS equivalent of Windows' BitLocker full-disk encryption?
A) Keychain  B) FileVault  C) Time Machine  D) Gatekeeper

**Q10.** Which Linux command grants execute permission on a script file?
A) `chown +x script.sh`  B) `sudo script.sh`  C) `chmod +x script.sh`  D) `ls -x script.sh`

**Q11.** An email client configuration needs to keep mail state (read/unread, folder structure) synced identically across a phone, tablet, and laptop. Which protocol should be used?
A) POP3  B) IMAP  C) SMTP  D) EAS only

**Q12.** Which ACPI power state corresponds to Hibernate?
A) S0  B) S1  C) S3  D) S4

**Q13.** A user's Windows 11 upgrade fails compatibility checks. Which built-in tool should be run first to diagnose why?
A) System Information  B) PC Health Check  C) Resource Monitor  D) Disk Cleanup

**Q14.** Which Windows tool would you use to build a single custom console containing Device Manager, Disk Management, and Event Viewer together?
A) Task Scheduler  B) MMC  C) Performance Monitor  D) System Configuration

**Q15.** What's the main functional difference between a 32-bit and 64-bit version of Windows regarding installed applications?
A) 32-bit apps can't run on 64-bit Windows  B) 64-bit Windows can run both 32-bit and 64-bit apps, but 32-bit Windows can't run 64-bit apps  C) There is no functional difference  D) 64-bit apps run slower on 64-bit Windows

**Q16.** A technician needs to deploy Windows to 200 new machines simultaneously over the network without using physical media. What boot method supports this?
A) USB boot  B) PXE boot  C) Optical media boot  D) Internal recovery partition

**Q17.** Which Linux package manager is associated with Debian/Ubuntu-based distributions?
A) yum  B) dnf  C) apt  D) pacman

---

## Domain 2: Security

**Q18.** Which combination of authentication factors qualifies as true multifactor authentication (MFA)?
A) Password + PIN  B) Password + hardware token code  C) PIN + security question  D) Two different passwords

**Q19.** What physical security control specifically prevents tailgating into a secure facility?
A) CCTV  B) Badge reader  C) Mantrap/access control vestibule  D) Security guard

**Q20.** An attacker impersonates a company's CFO in a targeted email to the accounting department. This is an example of:
A) Vishing  B) Whaling  C) Shoulder surfing  D) Tailgating

**Q21.** Which wireless security protocol should NEVER be recommended for a new deployment?
A) WPA3  B) WPA2  C) WEP  D) WPA2-Enterprise

**Q22.** What is the correct 3rd step in CompTIA's official 7-step malware removal process?
A) Remediate the infected system  B) Disable System Restore  C) Educate the end user  D) Schedule scans and run updates

**Q23.** A malware type self-replicates and spreads across a network without needing a host file or any user action. This describes a:
A) Virus  B) Trojan  C) Worm  D) Rootkit

**Q24.** A user's EFS-encrypted files became inaccessible after their account was deleted and recreated with the identical username. Why?
A) EFS requires domain membership  B) The new account has a new certificate, and decryption is tied to the original certificate  C) EFS files are deleted when an account is deleted  D) The files need to be re-shared

**Q25.** What hardware component does BitLocker rely on to securely store its encryption keys?
A) CMOS battery  B) TPM  C) CPU cache  D) UEFI firmware chip

**Q26.** Why does degaussing fail to securely erase data on an SSD?
A) SSDs are too fast for degaussing to work  B) SSDs store data electronically in flash memory, not magnetically  C) Degaussing only works on optical media  D) SSDs are encrypted by default

**Q27.** What is the single most commonly exploited SOHO router security misconfiguration?
A) Weak Wi-Fi channel selection  B) Leaving default admin credentials unchanged  C) Not using a mesh network  D) Enabling WPA3

**Q28.** Why should WPS be disabled on a SOHO router?
A) It reduces Wi-Fi signal range  B) Its PIN mechanism is vulnerable to brute-force attacks  C) It's only compatible with WEP  D) It disables the guest network

**Q29.** A user believes private/incognito browsing makes them completely anonymous online. Why is this incorrect?
A) Incognito mode doesn't block cookies  B) It only prevents local history/cookie storage; the ISP and visited sites can still see activity  C) Incognito mode is disabled by most antivirus software  D) It only works on mobile devices

**Q30.** What should a technician do immediately upon confirming a workstation is infected with malware, before beginning remediation?
A) Run a full antivirus scan  B) Isolate/quarantine the machine from the network  C) Notify the end user's manager  D) Reboot into Safe Mode

**Q31.** A corporate-owned smartphone was jailbroken by its user to install a custom feature. From a security standpoint, this is significant because:
A) It voids the manufacturer's warranty only  B) It bypasses the OS's built-in security sandboxing that MDM policy depends on  C) It's only a policy violation, not a technical risk  D) It improves the phone's security posture

**Q32.** What is the best data destruction method for a highly sensitive SSD that must be certified as unrecoverable?
A) Degaussing  B) Standard format  C) Physical destruction  D) Overwriting with three passes

**Q33.** Which access mode uses 802.1X and a RADIUS server to authenticate each wireless user individually rather than sharing one passphrase?
A) WPA2-Personal  B) WPA2/WPA3-Enterprise  C) WEP  D) Open authentication

**Q34.** UAC prompts appear even for a logged-in Administrator account performing an admin-level task. Why?
A) UAC is misconfigured  B) Administrators run with a standard-user token by default until elevation is approved  C) UAC only applies to standard user accounts  D) It's a bug that should be reported

---

## Domain 3: Software Troubleshooting

**Q35.** What is the correct first step in the CompTIA troubleshooting methodology?
A) Establish a theory of probable cause  B) Identify the problem  C) Document findings  D) Implement the solution

**Q36.** During troubleshooting, a technician's first theory of probable cause is tested and disproven. What should happen next?
A) Escalate immediately  B) Establish a new theory of probable cause  C) Document the failure and close the ticket  D) Implement a random fix and observe results

**Q37.** Which step is most commonly skipped by technicians, and is nonetheless a required step in the methodology?
A) Testing the theory  B) Documenting findings, actions, and outcomes  C) Identifying the problem  D) Establishing a plan of action

**Q38.** `sfc /scannow` reports it found corrupted files but could not fix some of them. What should be run first before trying `sfc` again?
A) `chkdsk /f /r`  B) `DISM /Online /Cleanup-Image /RestoreHealth`  C) `diskpart`  D) `gpupdate /force`

**Q39.** A domain-joined workstation suddenly can't authenticate with the domain controller, despite correct credentials. What overlooked factor is a classic cause?
A) DNS cache is stale  B) The system clock has drifted too far out of sync (Kerberos)  C) The NIC driver is outdated  D) The user's password expired

**Q40.** Print jobs are stuck in the queue and won't clear. What's the standard first fix?
A) Reinstall the printer driver  B) Restart the Print Spooler service and clear the spool folder  C) Replace the print cable  D) Run `sfc /scannow`

**Q41.** A user's desktop resets to default settings and files disappear at every login, though the files reappear if logging in with a different account. What's the likely cause?
A) Malware  B) A corrupted user profile  C) A failing hard drive  D) Insufficient RAM

**Q42.** Which symptom combination is the classic signature of cryptomining malware on a mobile device?
A) Slow Wi-Fi only  B) Device is unusually hot, slow, and drains battery quickly with no clear cause  C) App icons rearranged  D) Screen brightness resets

**Q43.** A user's antivirus software shows as disabled, and they insist they didn't turn it off. What does this most likely indicate?
A) A Windows Update bug  B) Active malware disabled it to avoid detection  C) The license expired  D) A driver conflict

**Q44.** What should you try FIRST when a misbehaving mobile app needs troubleshooting: clearing cache or clearing data?
A) Clearing data, since it's more thorough  B) Clearing cache, since it's less destructive and often sufficient  C) Neither — always reinstall first  D) They accomplish the same thing

**Q45.** A device won't reconnect to a Wi-Fi network it previously used successfully. What's the first troubleshooting step?
A) Factory reset the device  B) Forget the network and reconnect, re-entering credentials  C) Replace the device's Wi-Fi antenna  D) Contact the ISP

**Q46.** Before assuming a hardware or software fault for consistently slow cellular data, what simple explanation should be ruled out first?
A) The device case is blocking the antenna  B) The account has exceeded its data cap and is being throttled  C) The SIM card is defective  D) The OS needs updating

**Q47.** A user reports random pop-ups, a changed default search engine, and unfamiliar browser toolbars. What's the most likely cause?
A) A corrupted user profile  B) A browser hijacker/malicious extension  C) An outdated graphics driver  D) A Windows Update issue

**Q48.** A workstation exhibits a Blue Screen of Death (BSOD) after a recent driver update. What's the most appropriate first remediation step?
A) Reinstall Windows entirely  B) Boot into Safe Mode and roll back the recent driver  C) Replace the RAM  D) Run `chkdsk /f`

---

## Domain 4: Operational Procedures

**Q49.** What ticket field primarily determines how urgently an issue will be addressed?
A) Device asset tag  B) Priority/severity  C) User contact info  D) Category description length

**Q50.** Why is documentation still required even for a "quick and easy" fix?
A) It's a formality with no real value  B) It supports future troubleshooting, continuity, and may be required for compliance  C) Only complex fixes require documentation  D) It's optional per most organizational policies

**Q51.** What group typically reviews and approves significant IT changes before implementation?
A) The helpdesk team  B) The Change Advisory Board (CAB)  C) The end users affected  D) The vendor's support team

**Q52.** Why is a backout plan considered a mandatory part of change management, not optional?
A) It's required for insurance purposes only  B) It provides a tested way to undo the change if something goes wrong  C) It documents who requested the change  D) It replaces the need for testing

**Q53.** Which fire extinguisher class is correct for an electrical equipment fire?
A) Class A  B) Class B  C) Class C  D) Class K

**Q54.** A full backup runs every Sunday, and incremental backups run Monday through Friday. The system fails on Saturday. How many backup sets are needed to fully restore, and which ones?
A) Just the full backup from Sunday  B) The full backup plus every incremental from Monday through Friday (6 total)  C) Only the most recent incremental  D) The full backup plus only Friday's incremental (2 total)

**Q55.** What does the 3-2-1 backup rule specify?
A) 3 backups per day, 2 locations, 1 admin responsible  B) 3 copies of data, on 2 different media types, with 1 copy off-site  C) 3 years of retention, 2 full backups, 1 incremental  D) 3 different cloud providers, 2 accounts, 1 shared password

**Q56.** A technician discovers what appears to be illegal content on a customer's computer during a routine repair. What is the correct course of action?
A) Delete the content immediately and continue the repair  B) Confront the customer directly about it  C) Preserve the evidence and report it through the proper chain of custody/escalation procedure  D) Ignore it since it's not part of the requested repair

**Q57.** What is the key difference between PII and PHI?
A) They are the same thing  B) PII identifies a specific person generally; PHI is specifically health-related information covered under regulations like HIPAA  C) PHI applies only to minors  D) PII only applies to financial data

**Q58.** What is the primary risk of running an untested script with elevated permissions across many machines at once?
A) It will always fail silently  B) It can have unintended consequences and affect far more data/systems than intended, quickly  C) Scripts cannot run with elevated permissions  D) It will automatically be blocked by antivirus

**Q59.** Why should RDP never be exposed directly to the internet without a VPN in front of it?
A) RDP doesn't support encryption at all  B) It's a common target for brute-force and credential-stuffing attacks  C) RDP only works on local networks  D) It consumes too much bandwidth

**Q60.** In the IaaS cloud service model, which layer does the customer manage?
A) The physical hardware only  B) The OS and everything above it  C) Nothing — the provider manages everything  D) Only the application layer, never the OS

---

*End of practice exam. Check your answers in `answer-key.md`.*
