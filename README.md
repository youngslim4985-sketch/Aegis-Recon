Aegis Recon™

Attack Surface Discovery • Asset Intelligence • Security Reconnaissance

«Know Your Attack Surface Before Attackers Do.»

Aegis Recon™ is a cybersecurity reconnaissance and asset discovery platform designed to help security teams identify, inventory, and monitor internet-facing assets. It provides a centralized view of an organization's external attack surface, enabling proactive risk assessment and security investigations.

Built with a defensive security mindset, Aegis Recon helps organizations understand what systems are exposed, how they are changing over time, and where potential risks may exist.

---

Overview

Modern organizations often operate hundreds or thousands of internet-facing assets across cloud providers, on-premises infrastructure, APIs, and third-party services.

Aegis Recon is designed to provide continuous visibility into these assets through automated discovery, inventory management, and security-focused analysis.

---

Mission

Help organizations reduce cyber risk by improving visibility into their external attack surface and enabling informed security decisions.

---

Core Features

Asset Discovery

Identify and organize assets such as:

- Domains
- Subdomains
- Public IP addresses
- DNS records
- Web applications
- APIs
- Cloud-hosted services

---

Asset Inventory

Maintain a centralized inventory including:

- Asset ownership
- Discovery dates
- Technology identification
- Hosting provider
- Exposure status
- Tags and classifications

---

Technology Fingerprinting

Identify technologies powering discovered assets, including:

- Web servers
- Frameworks
- Content management systems
- Reverse proxies
- SSL/TLS configurations

---

Change Monitoring (Planned)

Track changes to discovered assets, including:

- Newly observed hosts
- DNS updates
- Certificate changes
- Service availability
- Technology changes

---

Risk Prioritization (Planned)

Support prioritization through factors such as:

- Exposure level
- Internet accessibility
- Configuration indicators
- Asset criticality
- Historical observations

---

Reporting

Generate reports for:

- Asset inventory
- Discovery summaries
- Exposure trends
- Technology distribution
- Executive overviews

---

Example Architecture

          Domains     Cloud     APIs     Public Services
               │          │         │            │
               └──────────┴─────────┴────────────┘
                          │
                  Discovery Engine
                          │
               Asset Classification
                          │
          ┌───────────────┴───────────────┐
          │                               │
  Technology Detection           Asset Inventory
          │                               │
          └───────────────┬───────────────┘
                          │
               Reporting & Dashboard

---

Technology Stack

Frontend

- React
- TypeScript
- Tailwind CSS

Backend

- FastAPI
- Node.js
- Express

Database

- PostgreSQL
- Redis

Infrastructure

- Docker
- GitHub Actions

---

Repository Structure

Aegis-Recon/

├── api/
├── collectors/
├── discovery/
├── fingerprinting/
├── dashboard/
├── reports/
├── docs/
├── tests/
└── README.md

---

Development Roadmap

Phase 1

- Asset inventory
- Domain discovery
- Dashboard
- Reporting

Phase 2

- Technology fingerprinting
- Exposure analysis
- Search and filtering
- Asset tagging

Phase 3

- Change monitoring
- Historical tracking
- Risk prioritization
- Notification workflows

Phase 4

- Enterprise asset management
- Multi-tenant support
- Compliance reporting
- Security workflow integrations

---

Design Principles

Aegis Recon is developed with the following principles:

- Security by design
- Explainable findings
- Modular architecture
- Responsible automation
- Scalable deployment
- Human oversight for security decisions

---

Related Projects

Aegis Recon complements the broader T&F ecosystem, including:

- T-F SOC
- T-F Holdings Cybersecurity Division
- T&F Build Agent
- T-F Blocks
- Entity Resolution Engine

Together, these projects aim to provide capabilities for software development, operational intelligence, and cybersecurity.

---

Responsible Use

Aegis Recon is intended for defensive security, authorized asset management, and security research.

Users are responsible for ensuring they have appropriate authorization before collecting information about systems they do not own or manage.

---

Contributing

Contributions, bug reports, feature requests, and documentation improvements are welcome. Please open an issue or submit a pull request.

---

License

MIT License

---

Built by T & F Investments & Holdings LLC

Discover Assets. Reduce Risk. Strengthen Security.<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/68d5c414-e18d-4b87-9735-6bd00f4aae01

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
