# 07 — Cloud & Virtualization Basics

**Domain:** 4.0 Operational Procedures (21%)
**Maps to objective:** 4.8 — Identify the basics of client-side virtualization

## Virtualization concepts

- **Hypervisor**: the software layer that creates/runs virtual machines
  - **Type 1 (bare-metal)**: runs directly on hardware, no host OS underneath (e.g., Hyper-V Server, ESXi) — used in enterprise/server contexts for performance
  - **Type 2 (hosted)**: runs as an application on top of a host OS (e.g., VirtualBox, VMware Workstation, Hyper-V on Windows desktop) — common for client-side/desktop virtualization
- **Virtual machine (VM)**: an isolated, emulated computer running its own OS, sharing the host's physical hardware

## Why client-side virtualization is used

| Use case | Why |
|---|---|
| **Sandboxing** | Test suspicious files/software in an isolated environment without risking the host |
| **Legacy software support** | Run an old OS a legacy app needs, without keeping legacy physical hardware |
| **Cross-platform testing** | Developers test software across multiple OS versions on one machine |
| **Resource consolidation** | Run multiple isolated environments on one physical machine |

## Resource requirements for host machines running VMs

- Sufficient RAM to cover host OS + each guest VM simultaneously
- CPU virtualization extensions enabled in BIOS/UEFI (Intel VT-x / AMD-V) — commonly a required troubleshooting step when VMs won't start
- Adequate storage — VMs are usually stored as large single files (VHD/VHDX/VMDK)
- Sometimes a dedicated/separate network configuration (virtual switches/NICs) for VM traffic

## Cloud computing concepts

| Model | Meaning |
|---|---|
| **IaaS** (Infrastructure as a Service) | Rent raw compute/storage/network — you manage the OS and up (e.g., AWS EC2) |
| **PaaS** (Platform as a Service) | Rent a platform to deploy apps on — provider manages OS/runtime, you manage your app/data |
| **SaaS** (Software as a Service) | Fully managed application, you just use it (e.g., Microsoft 365, Google Workspace) |

| Deployment model | Meaning |
|---|---|
| **Public cloud** | Shared infrastructure, provider-managed (AWS, Azure, GCP) |
| **Private cloud** | Dedicated infrastructure for one organization, on-prem or hosted |
| **Hybrid cloud** | Mix of public + private, workloads move between them |
| **Community cloud** | Shared by several organizations with common requirements (e.g., regulatory needs) |

## Key cloud characteristics (concept-level, often tested as definitions)

- **Rapid elasticity**: resources scale up/down automatically based on demand
- **On-demand self-service**: provision resources without needing a human on the provider's side
- **Resource pooling**: shared physical infrastructure serving multiple customers, isolated logically
- **Metered/measured service**: pay for what you actually use

## Quick self-check
1. What's the difference between a Type 1 and Type 2 hypervisor?
2. What CPU/BIOS setting commonly needs to be enabled before VMs will run on client hardware?
3. In IaaS, what layer does the customer manage versus what the provider manages?
4. What cloud characteristic means resources scale automatically based on demand?

<details>
<summary>Answers</summary>

1. Type 1 runs directly on the hardware with no underlying host OS (bare-metal, enterprise use); Type 2 runs as an application on top of an existing host OS (common for desktop/client virtualization).
2. CPU virtualization extensions (Intel VT-x / AMD-V) in BIOS/UEFI.
3. The customer manages the OS and everything above it; the provider manages the underlying physical infrastructure/hardware.
4. Rapid elasticity.
</details>
