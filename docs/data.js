export const PROJECTS_DATA = [
  // ==========================================
  // PROJECTS CENTER MAP (projects_interior)
  // ==========================================
  {
    id: "landing-zones",
    title: "AWS multi-account landing zones",
    npcName: "Cloud Architect Giulio",
    npcSprite: "architect",
    shortDescription: "A custom, enterprise-grade Landing Zone rewritten from scratch in pure Terraform. Zero reliance on Control Tower, LZA, AFT, or ADF — completely tailored per client to enforce domain isolation, automated security, multi-policy guardrails, and Platform Engineering GitOps.",
    deepDive: {
      architectureDiagram: `
┌────────────────────────────────────────────────────────────────────────────────┐
│                           AWS ORGANIZATIONS (ROOT)                             │
│                           - AWS Budgets & Global SCPs                          │
└───────────────────────────────────────┬────────────────────────────────────────┘
                                        │
             ┌──────────────────────────┴──────────────────────────┐
             ▼ Core / Infrastructure OU                            ▼ Workloads OU
┌─────────────────────────────────────────┐             ┌────────────────────────┐
│ [Automation & Platform Eng Account]     │             │ [Workload Accounts]    │
│  - OIDC Zero-Trust CI/CD & anti-drift   │             │  - Dev / Test / Prod   │
│  - Non-prod Start/Stop & GitOps Catalog │             │  - Strict domain scope │
├─────────────────────────────────────────┤             └────────────────────────┘
│ [Identity Account]                      │
│  - Central IAM Identity Center (AWS SSO)│
├─────────────────────────────────────────┤
│ [Network Account]                       │
│  - Transit Gateway & shared VPCs (RAM)  │
│  - Central Route53 DNS & egress rules   │
├─────────────────────────────────────────┤
│ [Shared Services Account]               │
│  - Resource Explorer & StackSets        │
├─────────────────────────────────────────┤
│ [Security Posture Account]              │
│  - Org Trail, Config, GuardDuty, Hub    │
│  - DNS/VPC log analysis & Inspector     │
├─────────────────────────────────────────┤
│ [Log Archive Account]                   │
│  - Immutable 1-Yr S3 Object Lock        │
│  - Cross-account OAM & anomaly engine   │
└─────────────────────────────────────────┘
`,
      details: [
        {
          tabTitle: "Design philosophy",
          content: "<strong>Custom-built from scratch:</strong><br><br>• <strong>Zero third-party abstractions:</strong> written purely in modular Terraform with zero reliance on vendor-locked tools — no AWS Control Tower, no Landing Zone Accelerator (LZA), and no wrapper frameworks like AFT or ADF.<br><br>• <strong>Tailored client realities:</strong> built on the principle that a healthcare company spending millions on cloud infrastructure has fundamentally different compliance, security, and auditing needs than a fashion brand. Every implementation is customized to match the client's operational context.<br><br>• <strong>Account customization engine:</strong> includes a custom, lightweight account customization framework to bootstrap new accounts, apply baseline security blueprints, and enforce GitOps principles."
        },
        {
          tabTitle: "Account architecture",
          content: "<strong>Core infrastructure & workload account layout:</strong><br><br>• <strong>Root Account:</strong> kept strictly minimalist. Restricted exclusively to AWS Organizations structure and global budget threshold alarms.<br><br>• <strong>Automation & Platform Eng Account (Core):</strong> centralized hub housing zero-trust OIDC deployment pipelines, automated Start/Stop FinOps schedules for non-prod environments, hourly Terraform anti-drift checks, and the Platform Engineering portal for self-service blueprint deployment.<br><br>• <strong>Identity Account (Core):</strong> central IAM Identity Center (AWS SSO) managing organizational permission sets, RBAC roles, and SSO integration.<br><br>• <strong>Network Account (Core):</strong> centralizes Transit Gateway (TGW) cross-account routing, egress internet gateways, shared VPCs via RAM, and central Route53 private DNS hosted zones.<br><br>• <strong>Shared Services Account (Core):</strong> holds organization-wide Resource Explorer inventories, common Lambda layers, CloudFormation StackSets, external backup vaults, and unified Landing Zone notification/alerting channels.<br><br>• <strong>Security & Log Archive Accounts (Core):</strong> central security posture (GuardDuty, Config, Security Hub) and immutable 1-year S3 Object Lock compliance logging.<br><br>• <strong>Workload Accounts (Dev / Test / Prod):</strong> strict domain isolation to eliminate blast radius. Workload accounts only contain what the project actually requires. Even if an account's AdministratorAccess were compromised, the attacker cannot reach global SES identities, Route53 DNS zones, core networking, or CI/CD secrets."
        },
        {
          tabTitle: "Policy guardrails",
          content: "<strong>Multi-layered policy ecosystem:</strong><br><br>• <strong>Beyond SCPs:</strong> enforces governance using the full spectrum of AWS policy controls:<br>  - <strong>Service Control Policies (SCPs):</strong> defines organizational permission boundaries and enforces digital sovereignty / region locks.<br>  - <strong>Resource Control Policies (RCPs):</strong> implements strict data perimeter boundaries directly at the resource level.<br>  - <strong>Declarative & Tag Policies:</strong> enforces standardized tagging conventions, lifecycle rules, and mandatory backup schedules.<br>  - <strong>Upgrade Rollout Policies:</strong> orchestrates controlled, non-breaking OS/runtime patch orders across non-prod before hitting production.<br>  - <strong>AI Opt-Out & Bedrock Policies:</strong> enforces AI model opt-outs to protect client data and restricts Amazon Bedrock endpoints to authorized regions.<br><br>• <strong>Protections:</strong> prevents accidental deletion of critical infrastructure, stops confused deputy attacks, and blocks data exfiltration."
        },
        {
          tabTitle: "Security & automation",
          content: "<strong>Automated threat detection & auditing:</strong><br><br>• <strong>Centralized Security Posture:</strong> consolidates Organization CloudTrail, AWS Config for real-time compliance rules, GuardDuty threat detection, and Security Hub.<br><br>• <strong>Automated Log Analysis:</strong> real-time serverless analysis of DNS query logs and VPC Flow Logs, paired with honeypot decoy traps and Amazon Inspector CVE vulnerability scanning.<br><br>• <strong>Log Archive Immutability:</strong> all log streams flow to the Log Archive account with S3 Object Lock in Compliance Mode, enforcing a mandatory 1-year immutability retention.<br><br>• <strong>Cross-Account Observability & Querying:</strong> supports read-mode log inspection via CloudWatch Observability Access Manager (OAM) or Observability Admin. Preconfigured SQL/Athena queries flag unusual geolocalization origins, off-hours access patterns, and unexpected API spikes."
        },
        {
          tabTitle: "Identity & Zero-Trust",
          content: "<strong>Granular RBAC & zero-trust pipeline:</strong><br><br>• <strong>Domain-Separated Access Control:</strong><br>  - <strong>Infrastructure Admins:</strong> global platform engineering access.<br>  - <strong>DevOps Teams:</strong> scoped administrative power restricted to workload accounts.<br>  - <strong>Suppliers & Vendors:</strong> view-only access (logs, metrics, notifications) with audited elevation paths.<br>  - <strong>Custom Roles:</strong> purpose-built IAM roles for specific edge-case integrations.<br><br>• <strong>Zero-Trust Deployment:</strong> completely eliminates static IAM access keys. CI/CD pipelines deploy applications strictly via OIDC role federation with payload signing.<br><br>• <strong>Centralized Encryption:</strong> enforces single Customer Managed Keys (CMKs) per account with key policies that prevent accidental deletion or disabling."
        },
        {
          tabTitle: "Networking & DNS",
          content: "<strong>Centralized network hub:</strong><br><br>• <strong>Network Account Hub:</strong> centralizes Transit Gateway (TGW) cross-account routing, egress internet gateways, and NAT traffic.<br><br>• <strong>Shared VPCs via RAM:</strong> centralized subnets are managed in the Network account and shared securely with workload accounts via AWS Resource Access Manager (RAM), avoiding unnecessary TGW hourly charges where simple VPC sharing suffices.<br><br>• <strong>Centralized Route53 DNS:</strong> centralized private DNS hosted zones and outbound domain filtering protect against DNS tunneling or unauthorized external calls."
        }
      ]
    }
  },
  {
    id: "data-lake",
    title: "AWS enterprise data lake",
    npcName: "Data Engineer Giulio",
    npcSprite: "engineer",
    shortDescription: "A unified enterprise-grade data lake ingesting from DMS CDC, IoT, DataSync, and Amplify, managed via Lake Formation for secure Athena, BI, and AI consumption.",
    deepDive: {
      architectureDiagram: `
┌────────────────────────────────────────────────────────────────────────────────┐
│                          1. MULTI-SOURCE INGESTION                             │
│ - On-Prem CDC (DMS) | IoT Telemetry | Cross-Cloud (DataSync) | APIs (Amplify)  │
└───────────────────────────────────────┬────────────────────────────────────────┘
                                        │
                                        ▼
┌────────────────────────────────────────────────────────────────────────────────┐
│                     2. REAL-TIME STREAMING & BUFFERING                         │
│ - Kinesis Data Streams (high throughput) & Kinesis Firehose (S3 micro-batches) │
└───────────────────────────────────────┬────────────────────────────────────────┘
                                        │
                                        ▼
┌────────────────────────────────────────────────────────────────────────────────┐
│                    3. MULTI-TIER S3 STORAGE & GLUE ETL                         │
│ [L0 Raw Ingestion (JSON/CSV)] ──> PySpark Glue ETL ──> [L1 Cleansed (Parquet)] │
└───────────────────────────────────────┬────────────────────────────────────────┘
                                        │
                                        ▼
┌────────────────────────────────────────────────────────────────────────────────┐
│                    4. METADATA CATALOG & GOVERNANCE                            │
│ - Glue Crawlers (auto-schema) | AWS Lake Formation (row/column/cell security) │
└───────────────────────────────────────┬────────────────────────────────────────┘
                                        │
                         ┌──────────────┴──────────────┐
                         ▼                             ▼
┌─────────────────────────────────────────┐   ┌──────────────────────────────────┐
│         5a. ANALYTICS & BI              │   │     5b. ADVANCED AI & ML         │
│ - Athena & Redshift Spectrum queries    │   │ - SageMaker Studio & ML models   │
│ - PowerBI & MicroStrategy dashboards    │   │ - Real-time inference pipelines  │
└─────────────────────────────────────────┘   └──────────────────────────────────┘
`,
      details: [
        {
          tabTitle: "Architecture & ingestion",
          content: "<strong>Multi-source ingestion pipeline:</strong><br><br>• <strong>On-premises databases:</strong> leverages AWS DMS (database migration service) with continuous change data capture (CDC) to stream live transactional writes without service interruption.<br><br>• <strong>IoT & cross-cloud:</strong> ingests high-frequency device metrics via IoT telemetry channels and synchronizes cross-cloud storage using AWS DataSync.<br><br>• <strong>Real-time streaming:</strong> consumes high-throughput event streams via Kinesis Data Streams and Kinesis Firehose for instant S3 micro-batching.<br><br>• <strong>APIs & mobile:</strong> direct integrations for web and mobile platforms powered by AWS Amplify and AWS API Gateway."
        },
        {
          tabTitle: "Processing & ETL",
          content: "<strong>Multi-tier S3 storage & serverless ETL:</strong><br><br>• <strong>L0 raw landing zone:</strong> all ingested data lands in raw format (JSON, CSV, Avro) in partitioned L0 S3 buckets.<br><br>• <strong>Serverless Glue PySpark ETL:</strong> distributed AWS Glue jobs transform raw data, enforce schemas, eliminate duplicates, and write Snappy-compressed columnar Parquet files into L1 cleansed storage.<br><br>• <strong>Automated metadata catalog:</strong> Glue crawlers automatically scan L1 storage to discover schema updates and maintain the central Glue Data Catalog."
        },
        {
          tabTitle: "Governance & Lake Formation",
          content: "<strong>Centralized access control & governance:</strong><br><br>• <strong>AWS Lake Formation:</strong> replaces complex S3 bucket policies with unified database-style security rules.<br><br>• <strong>Fine-grained permissions:</strong> enforces column, row, and cell-level security rules tailored for analytics teams, data scientists, and external vendors.<br><br>• <strong>Auditability & compliance:</strong> prevents data exfiltration and maintains centralized query logging for GDPR and ISO 27001 auditing."
        },
        {
          tabTitle: "Analytics, BI & AI",
          content: "<strong>Analytical consumption & machine learning:</strong><br><br>• <strong>High-performance SQL:</strong> serverless ad-hoc queries via Amazon Athena and high-speed lakehouse queries across petabytes using Amazon Redshift Spectrum.<br><br>• <strong>Enterprise business intelligence:</strong> connects directly with PowerBI and MicroStrategy dashboards for real-time reporting.<br><br>• <strong>SageMaker ML pipelines:</strong> cleansed L1 Parquet data feeds Amazon SageMaker for real-time customer predictions, demand forecasting, and anomaly detection."
        }
      ]
    }
  },
  {
    id: "garbage-collector",
    title: "AWS garbage collector",
    npcName: "Automation Expert",
    npcSprite: "engineer",
    shortDescription: "A serverless cloud utility that scans Sandbox/Non-Prod accounts, traces creators via SSO CloudTrail logs, sends interactive SES emails to extend resource lifespans, and cleans unextended assets via Cloud Control API.",
    deepDive: {
      architectureDiagram: `
┌────────────────────────────────────────────────────────────────────────────────┐
│                        1. SCHEDULED RESOURCE DISCOVERY                         │
│ EventBridge Cron ──> Resource Explorer (Sandbox/Non-Prod) ──> Almost Any Asset │
└───────────────────────────────────────┬────────────────────────────────────────┘
                                        │
                                        ▼
┌────────────────────────────────────────────────────────────────────────────────┐
│                   2. DYNAMODB CATALOG & SSO CREATOR TRACING                     │
│ DynamoDB Inventory w/ TTL ──> CloudTrail Lookup (SSO Email Mapping)           │
└───────────────────────────────────────┬────────────────────────────────────────┘
                                        │
                                        ▼
┌────────────────────────────────────────────────────────────────────────────────┐
│                3. DYNAMODB STREAM & INTERACTIVE SES EXTENSION                  │
│ Stream Handler ──> 2x SES Warning Emails ──> Custom Clickable Extension Link   │
└───────────────────────────────────────┬────────────────────────────────────────┘
                                        │ (If unextended after grace period)
                                        ▼
┌────────────────────────────────────────────────────────────────────────────────┐
│                    4. TEARDOWN & FINOPS RECOVERY                               │
│ Cloud Control API Invocation ──> Automated Deletion ──> Direct Cost Recovery   │
└────────────────────────────────────────────────────────────────────────────────┘
`,
      details: [
        {
          tabTitle: "Architecture & discovery",
          content: "<strong>Multi-account non-prod discovery:</strong><br><br>• <strong>Sandbox & non-prod scoping:</strong> operates strictly across Sandbox and non-production accounts to optimize cloud costs without risk to production workloads.<br><br>• <strong>Universal resource coverage:</strong> leverages AWS Resource Explorer and Cloud Control API to discover almost any orphaned or idle resource class.<br><br>• <strong>Tag-based exemptions:</strong> respects tag-based whitelisting (e.g., <code>GarbageCollector: Exempt</code> or <code>TTL: Never</code>) to protect long-running test fixtures or static dev baselines."
        },
        {
          tabTitle: "Identity tracing & notifications",
          content: "<strong>SSO attribution & interactive extension links:</strong><br><br>• <strong>SSO CloudTrail mapping:</strong> because all team members authenticate via IAM Identity Center (AWS SSO), CloudTrail event logs directly reveal the user's corporate email address for effortless creator attribution.<br><br>• <strong>Two-stage warning workflow:</strong> sends two automated email notifications via Amazon SES prior to TTL expiration.<br><br>• <strong>One-click lifespan extension:</strong> each email includes a custom clickable link allowing the creator to instantly renew or extend the resource TTL with a single click if still needed."
        },
        {
          tabTitle: "Automated enforcement & FinOps",
          content: "<strong>Cloud Control API teardown & cost recovery:</strong><br><br>• <strong>Automated teardown:</strong> if the extension link goes unclicked throughout the warning window, the DynamoDB TTL stream triggers automated resource deletion via the unified AWS Cloud Control API.<br><br>• <strong>Radical cost recovery:</strong> continuously reclaims wasted cloud budget from forgotten sandbox experiments and idle dev assets.<br><br>• <strong>Serverless pay-per-use:</strong> 100% serverless footprint running on EventBridge, Lambda, DynamoDB, API Gateway, and SES with zero fixed infrastructure overhead."
        }
      ]
    }
  },
  {
    id: "vdi-cloud",
    title: "Enterprise VDI on cloud",
    npcName: "VDI Engineer",
    npcSprite: "architect",
    shortDescription: "Air-gapped virtual work environments on AWS using AppStream 2.0 and WorkSpaces for PowerBI analysts, integrating Entra ID and Managed AD with strict DLP controls.",
    deepDive: {
      architectureDiagram: `
┌────────────────────────────────────────────────────────────────────────────────┐
│                   1. IDENTITY & DIRECTORY EVOLUTION                            │
│ Managed AD (WorkSpaces) ──> Entra ID / Azure AD SAML 2.0 (AppStream 2.0)       │
└───────────────────────────────────────┬────────────────────────────────────────┘
                                        │
                         ┌──────────────┴──────────────┐
                         ▼                             ▼
┌─────────────────────────────────────────┐   ┌──────────────────────────────────┐
│    2a. POWERBI APPSTREAM (EPHEMERAL)    │   │    2b. WORKSPACES (PERSISTENT)   │
│ - Non-persistent PowerBI desktop fleet  │   │ - Dedicated Win/Linux desktops   │
│ - Instant analyst onboarding/offboard   │   │ - AutoStop & AlwaysOn FinOps     │
└────────────────────┬────────────────────┘   └────────────────┬─────────────────┘
                     │                                         │
                     └────────────────────┬────────────────────┘
                                          │
                                          ▼
┌────────────────────────────────────────────────────────────────────────────────┐
│                  3. DATA LOSS PREVENTION (DLP) & AIR-GAPPING                   │
│ - Local Drive Redirection Blocked | Clipboard Disabled | Zero Local Laptop Data│
└───────────────────────────────────────┬────────────────────────────────────────┘
                                        │
                                        ▼
┌────────────────────────────────────────────────────────────────────────────────┐
│               4. SECURE ANALYTICS & POWERBI CONNECTIVITY                       │
│ PowerBI ODBC Drivers (Import & DirectQuery) ──> Private VPC Air-Gapped Subnets │
└────────────────────────────────────────────────────────────────────────────────┘
`,
      details: [
        {
          tabTitle: "Architecture & PowerBI VDI",
          content: "<strong>Secure PowerBI analyst workstations:</strong><br><br>• <strong>PowerBI VDI fleet:</strong> designed and deployed secure cloud virtual desktop environments tailored specifically for data analysts running PowerBI Desktop.<br><br>• <strong>Instant onboarding & offboarding:</strong> enables rapid provisioning for internal teams and external consultants with zero data residing on personal or corporate laptops.<br><br>• <strong>Air-gapped VPC networking:</strong> streaming sessions run inside isolated, air-gapped private subnets with strict egress security rules."
        },
        {
          tabTitle: "Identity & directory evolution",
          content: "<strong>Multi-directory identity architecture:</strong><br><br>• <strong>Architectural evolution:</strong> initialized with <strong>AWS Managed Microsoft AD</strong> for persistent WorkSpaces, and evolved to <strong>Entra ID (Azure AD)</strong> SAML 2.0 federation for AppStream 2.0.<br><br>• <strong>Flexible Directory Integration:</strong> supports any directory pattern required by client compliance standards, including AD Connector and Azure AD SSO.<br><br>• <strong>Single Sign-On (SSO):</strong> enforces centralized multi-factor authentication (MFA) and conditional access policies."
        },
        {
          tabTitle: "Data Loss Prevention (DLP)",
          content: "<strong>Air-gapped data residency & DLP:</strong><br><br>• <strong>Zero laptop data footprint:</strong> guarantees that sensitive business datasets never leave the secure AWS cloud environment.<br><br>• <strong>Strict policy enforcement:</strong> Group Policies (GPOs) and AppStream stack policies block local disk drive redirection, clipboard copy/pasting, local printing, and file downloads.<br><br>• <strong>GDPR & regulatory compliance:</strong> satisfies strict European data residency mandates by keeping interactive sessions purely visual while datasets stay 100% cloudbound."
        },
        {
          tabTitle: "Data sources & FinOps",
          content: "<strong>PowerBI connectivity & fleet optimization:</strong><br><br>• <strong>PowerBI ODBC integration:</strong> pre-configured ODBC drivers enable high-performance data ingestion in both <strong>Import Mode</strong> and real-time <strong>DirectQuery Mode</strong>.<br><br>• <strong>Data lake foundation:</strong> laid the secure connectivity groundwork for the client's broader enterprise data lake initiative.<br><br>• <strong>Fleet FinOps optimization:</strong> AppStream auto-scaling schedules and WorkSpaces AutoStop / AlwaysOn billing mode optimization."
        }
      ]
    }
  },
  {
    id: "menupp-webapp",
    title: "Menupp: serverless web app",
    npcName: "Fullstack Developer",
    npcSprite: "developer",
    shortDescription: "A serverless web app for digital restaurant QR menus, allowing owners to easily customize menu items, graphics, and pricing via a web portal with hyper-cheap running costs.",
    deepDive: {
      architectureDiagram: `
┌────────────────────────────────────────────────────────────────────────────────┐
│                       1. FAST FRONTEND & QR DISTRIBUTION                       │
│ Diners Scan QR Code ──> CloudFront CDN ──> Encrypted S3 Static Host (React)    │
└───────────────────────────────────────┬────────────────────────────────────────┘
                                        │
                                        ▼
┌────────────────────────────────────────────────────────────────────────────────┐
│                   2. AUTHENTICATION & MANAGEMENT PORTAL                        │
│ Restaurant Owner Login ──> Amazon Cognito Auth ──> API Gateway REST Endpoints  │
└───────────────────────────────────────┬────────────────────────────────────────┘
                                        │
                                        ▼
┌────────────────────────────────────────────────────────────────────────────────┐
│                  3. SERVERLESS BACKEND & HYPER-CHEAP STORAGE                   │
│ AWS Lambda (Python) ──> DynamoDB Single-Table (Instant Menu & Style Updates)   │
└────────────────────────────────────────────────────────────────────────────────┘
`,
      details: [
        {
          tabTitle: "Overview & lifecycle story",
          content: "<strong>Serverless QR menu platform:</strong><br><br>• <strong>Fullstack serverless web app:</strong> built as a lightweight, fully serverless web application empowering restaurant owners to offer digital QR menus with customizable branding, dish categories, and pricing.<br><br>• <strong>Production pilot & lifecycle story:</strong> originally launched as a live pilot for a restaurant client, the app enabled instant menu management directly from an intuitive web dashboard. Following a successful production trial, the client eventually adopted an all-in-one POS system with integrated hardware terminals, leaving the codebase preserved as a proven reference architecture.<br><br>• <strong>Hyper-cheap serverless FinOps:</strong> built entirely on pay-per-use AWS services (CloudFront, S3, Cognito, API Gateway, Lambda, and DynamoDB), resulting in near-zero running costs when inactive."
        },
        {
          tabTitle: "Owner portal & customization",
          content: "<strong>Self-service menu management:</strong><br><br>• <strong>Easy menu management:</strong> restaurant owners log in securely to quickly modify dish categories, descriptions, prices, and allergen tags directly from the web interface.<br><br>• <strong>Custom graphics & branding:</strong> allows owners to easily customize font styles, color themes, and logo graphics on their public digital menu to match their restaurant's aesthetic.<br><br>• <strong>Instant diner updates:</strong> updates made in the owner portal take effect immediately when diners scan the restaurant's QR code."
        },
        {
          tabTitle: "Serverless web architecture",
          content: "<strong>Frontend delivery & backend microservices:</strong><br><br>• <strong>CloudFront & S3 hosting:</strong> static React application hosted in an encrypted S3 bucket behind CloudFront for fast global asset delivery on customer mobile devices.<br><br>• <strong>Cognito user authentication:</strong> Amazon Cognito User Pools handle secure owner authentication and session management.<br><br>• <strong>Python Lambda functions:</strong> stateless AWS Lambda microservices process menu updates, upload image assets, and handle API requests."
        },
        {
          tabTitle: "DynamoDB NoSQL database",
          content: "<strong>Single-Table database modeling:</strong><br><br>• <strong>Single-Table design:</strong> structured DynamoDB single-table schema that retrieves a restaurant's full menu, branding settings, and categories in a single query.<br><br>• <strong>On-demand capacity:</strong> pay-per-request billing ensures that database costs scale down to near zero during off-hours when restaurants are closed."
        }
      ]
    }
  },

  // ==========================================
  // SKILLS ACADEMY MAP (skills_interior)
  // ==========================================
  {
    id: "skills-advisor",
    title: "Career journey guide",
    npcName: "Journey Guide",
    npcSprite: "architect",
    shortDescription: "Welcome to my career and education path. Walk along the corridor to see my milestones from linguistic high school to AWS Tech Lead.",
    dialogue: [
      "Hey there! Welcome to my career and education path.",
      "If you walk down this corridor from left to right, you can trace my timeline chronologically.",
      "It starts with my high school days when I first taught myself to code, and runs all the way to my recent work as an AWS Tech Lead.",
      "Feel free to talk to the characters along the way to see what I did and learned at each stop!"
    ],
    deepDive: {
      architectureDiagram: `
┌────────────────────────────────────────────────────────────────────────┐
│                        TECH LEAD SKILLS INVENTORY                      │
├────────────────────────────────────────────────────────────────────────┤
│  [Cloud & IaC]       [Languages & scripts]    [Architecture patterns]  │
│  - AWS organization  - Python (serverless)   - Serverless (micro)     │
│  - Terraform (IaC)   - Node.js (web apps)    - Data lakes (analytics) │
│  - Control Tower     - Bash / shell script   - Event-driven (queues)  │
└────────────────────────────────────────────────────────────────────────┘
`,
      details: [
        {
          tabTitle: "Philosophy",
          content: "<strong>The holistic engineering approach:</strong><br><br>To deliver high quality products, you need to know a lot. Giulio advocates that separating cloud fields into isolated silos leads to common disasters (e.g. exposed databases, out-of-date unpatched VMs, leaked keys).<br><br>• A <strong>solution architect</strong> without development background won't write dry, modular, reusable IaC code.<br>• A <strong>developer</strong> without clear system/network understanding won't design high-performance, cost-efficient microservices.<br><br>Therefore, mastering architecture, infrastructure-as-code, scripting, and security concurrently is the only way to build production-ready software."
        },
        {
          tabTitle: "Cloud & IaC",
          content: "<strong>Core Cloud & Infrastructure-as-Code capabilities:</strong><br><br>• <strong>AWS Organizations & Landing Zones:</strong> multi-account management, Control Tower, and Service Control Policy (SCP) security boundaries.<br>• <strong>Modular Terraform & CDK:</strong> reusable IaC modules, state management, and automated drift detection.<br>• <strong>Transit Networking:</strong> Transit Gateway (TGW) hub-and-spoke topologies, Shared VPCs, and RAM subnet sharing."
        },
        {
          tabTitle: "Languages",
          content: "<strong>Languages & automation tools:</strong><br><br>• <strong>Python 3.x:</strong> serverless AWS Lambda microservices, Boto3 automation scripts, and ETL data pipelines.<br>• <strong>Node.js / Modern JS:</strong> React web frontends, Vite build tooling, and lightweight API integrations.<br>• <strong>Bash & Shell scripting:</strong> Linux CLI automation, CI/CD pipeline scripts, and developer workspace setup."
        }
      ]
    }
  },
  {
    id: "thesis-helios",
    title: "Helios P2P simulator",
    npcName: "Helios Researcher",
    npcSprite: "engineer",
    shortDescription: "My Bachelor's thesis on the EU-funded Helios project: modeling decentralized social networks and P2P routing using Java and 'THE ONE' simulator.",
    dialogue: [
      "Hey! Welcome to the Helios project stop.",
      "For my Bachelor's thesis in Computer Science at the University of Pisa, I worked on decentralized peer-to-peer routing.",
      "I extended a Java-based simulator called 'THE ONE' to model opportunistic communications with ego-contextual metrics.",
      "By doing this, we simulated how private social networks can exchange data without centralized servers."
    ],
    deepDive: {
      architectureDiagram: `
┌────────────────────────────────────────────────────────────────────────┐
│                        HELIOS P2P NODE SIMULATION                      │
├────────────────────────────────────────────────────────────────────────┤
│ ┌──────────────┐       P2P Wi-Fi/Bluetooth      ┌──────────────┐       │
│ │ Helios NodeA │ <────────────────────────────> │ Helios NodeB │       │
│ ├──────────────┤                                ├──────────────┤       │
│ │ - Context UI │                                │ - Context UI │       │
│ │ - Ego cache  │                                │ - Ego cache  │       │
│ └──────────────┘                                └──────────────┘       │
│        │                                               │               │
│        └──────────── Extended Java THE ONE Simulator ──┘               │
└────────────────────────────────────────────────────────────────────────┘
`,
      details: [
        {
          tabTitle: "Overview",
          content: "The Helios project is an EU-funded initiative to build a decentralized, privacy-preserving social network. For his Bachelor's thesis at the University of Pisa, Giulio extended 'THE ONE' (Opportunistic Network Environment) simulator written in Java. By parsing anonymized real-world GPS mobility datasets, he simulated routing algorithms and contextual data exchanges directly between P2P nodes in an opportunistic network environment."
        },
        {
          tabTitle: "Java router class",
          content: "<strong>Opportunistic routing simulation in Java:</strong><br><br>• <strong>Extended 'THE ONE' simulator:</strong> extended the Java-based Opportunistic Network Environment simulator to model P2P node movement.<br>• <strong>Ego-contextual metrics:</strong> evaluated node contacts and social trust scores to route messages without centralized infrastructure.<br>• <strong>GPS dataset analysis:</strong> parsed anonymized real-world mobility traces to test data delivery rates and latency under realistic conditions."
        }
      ]
    }
  },
  {
    id: "thesis-webshell",
    title: "Cybersecurity web shell",
    npcName: "Security Researcher",
    npcSprite: "developer",
    shortDescription: "My Master's thesis (110/110) on offensive and defensive cybersecurity: custom web shells built to test and bypass commercial security detection systems.",
    dialogue: [
      "Hey! Welcome to my Master's thesis stop.",
      "I focused on offensive and defensive web security at the University of Pisa, graduating with top honors (110/110).",
      "I built and analyzed custom stealth web shells based on 'China Chopper' mechanics to test enterprise defenses.",
      "By studying how these bypass IDS/IPS signature detectors, we established guidelines for hardening web servers."
    ],
    deepDive: {
      architectureDiagram: `
┌───────────────────────────────┐               ┌────────────────────────┐
│      ATTACKER INTERFACE       │               │     VICTIM WEB SERVER  │
├───────────────────────────────┤               ├────────────────────────┤
│- Encrypted obfuscated payload │ ────────────> │- Single line evaluator │
│- Dynamic command exec         │               │- Bypasses IDS/IPS & AV │
└───────────────────────────────┘               └──────────────────┬─────┘
                                                                   │
                                                                   ▼
                                                        ┌────────────────┐
                                                        │ REVERSE SHELL  │
                                                        ├────────────────┤
                                                        │- System access │
                                                        └────────────────┘
`,
      details: [
        {
          tabTitle: "Overview",
          content: "Earning a score of 110/110 and a European supplement diploma from the University of Pisa, Giulio's Master's thesis focused on offensive and defensive web security. He analyzed, modified, and built a custom lightweight web shell based on the famous 'China Chopper' exploit. By utilizing stealth execution patterns and customized obfuscation, the web shell successfully bypassed commercial antivirus systems, intrusion detection systems (IDS), and intrusion prevention systems (IPS), providing a model to validate corporate server defenses."
        },
        {
          tabTitle: "Stealth payload",
          content: "<strong>Offensive & defensive security research:</strong><br><br>• <strong>Custom web shell architecture:</strong> analyzed and engineered lightweight web shells based on 'China Chopper' mechanics.<br>• <strong>Signature bypass techniques:</strong> implemented dynamic evaluation and character obfuscation to evaluate IDS/IPS signature filters.<br>• <strong>Hardening recommendations:</strong> formulated concrete mitigation guidelines for web server isolation, disable_functions, and WAF rules."
        }
      ]
    }
  },
  {
    id: "lab-assistant",
    title: "CS teaching assistant",
    npcName: "CS Teaching Assistant",
    npcSprite: "developer",
    shortDescription: "My role as a Teaching Assistant at the University of Pisa, mentoring students on cloud paradigms, distributed systems, and software energy efficiency using AWS.",
    dialogue: [
      "Welcome to the University of Pisa's CS department!",
      "I worked as a Teaching Assistant for the Cloud & Green Computing course in 2021.",
      "I mentored students on cloud paradigms, distributed systems, and software energy efficiency.",
      "We ran practical labs to measure and optimize workloads, using AWS as our core hands-on environment."
    ],
    deepDive: {
      architectureDiagram: `
┌────────────────────────────────────────────────────────────────────────┐
│                      UNIVERSITY LAB WORKSTATION                        │
├────────────────────────────────────────────────────────────────────────┤
│  [Module 1: IAM]     ───>  [Module 2: Network]   ───>  [Module 3: Scale]│
│  - Secure roles            - VPC isolation             - EC2 autoscaling│
│  - MFA enforcement         - Private subnets           - ALB routing    │
└────────────────────────────────────────────────────────────────────────┘
`,
      details: [
        {
          tabTitle: "Overview",
          content: "During his role at the University of Pisa, Giulio mentored and instructed master's level students on Cloud Computing architectures. He created and graded lab exercises involving AWS IAM, secure VPC networking, EC2 autoscaling, and serverless S3 + Lambda triggers, helping students bridge academic computer science theory with industrial cloud practitioner skills."
        },
        {
          tabTitle: "Practice lab IaC",
          content: "<strong>Cloud lab curriculum & hands-on exercises:</strong><br><br>• <strong>Secure VPC networking:</strong> guided students in building multi-AZ VPCs with public/private subnet tiering and NAT gateways.<br>• <strong>Security groups & NACLs:</strong> taught stateful vs stateless traffic filtering principles for web applications.<br>• <strong>Infrastructure-as-Code:</strong> introduced Terraform for automated lab setup and reproducible environment teardowns."
        }
      ]
    }
  },

  // ==========================================
  // CONTACT LOUNGE MAP (contact_interior)
  // ==========================================
  {
    id: "contact-assistant",
    title: "Lounge host",
    npcName: "Lounge Host",
    npcSprite: "developer",
    shortDescription: "A welcoming guide to the Contact Lounge. Use the interactive terminals to reach out or see my social links.",
    dialogue: [
      "Hey! Welcome to the Contact Lounge. Glad you made it here.",
      "To make it easy to connect, I've set up three simple terminals around the room.",
      "On the left, you can open a tab to my LinkedIn profile; straight ahead is my e-mail; and on the right is my GitHub profile.",
      "Just walk up to any of them and press Space or Enter to open them up!"
    ],
    deepDive: null
  },
  {
    id: "contact-linkedin",
    title: "LinkedIn console",
    npcName: "LinkedIn Console",
    npcSprite: "architect",
    shortDescription: "Open my LinkedIn profile in a new tab to see my network and professional updates.",
    dialogue: [
      "This terminal will take you directly to my LinkedIn profile.",
      "Would you like to open it in a new browser tab to connect?"
    ],
    deepDive: null
  },
  {
    id: "contact-email",
    title: "Email terminal",
    npcName: "Email Terminal",
    npcSprite: "engineer",
    shortDescription: "Draft an email to me in your default email client. I'd love to chat!",
    dialogue: [
      "This terminal lets you draft an email directly to my inbox.",
      "Would you like to open your email client?"
    ],
    deepDive: null
  },
  {
    id: "contact-github",
    title: "GitHub terminal",
    npcName: "GitHub Terminal",
    npcSprite: "developer",
    shortDescription: "Open my GitHub profile to see some of my open-source code and experiments.",
    dialogue: [
      "This will take you to my public profile to see older projects.",
      "Would you like to open it in a new browser tab?"
    ],
    deepDive: null
  },
  {
    id: "storm-reply",
    title: "Storm Reply cloud solution architect",
    npcName: "Storm Reply Rep",
    npcSprite: "architect",
    shortDescription: "My experience as a Cloud Solution Architect at Storm Reply in Turin, leading cloud migrations, modular IaC library development, and GDPR-compliant EUC setups.",
    dialogue: [
      "Hi! Welcome to the Storm Reply stop on our timeline.",
      "Giulio worked here as a Cloud Solution Architect, leading key migration and cloud modernization projects.",
      "He designed enterprise data lakes, built reusable Terraform libraries to bridge Dev and Ops, and deployed secure end-user computing solutions.",
      "His VDI setups using Amazon WorkSpaces and AppStream 2.0 ensured strict GDPR compliance for sensitive data access."
    ],
    deepDive: {
      architectureDiagram: `
┌────────────────────────────────────────────────────────────────────────┐
│                        STORM REPLY AWS ENTERPRISE                      │
├────────────────────────────────────────────────────────────────────────┤
│  [Terraform IaC]     ───>  [Security baselines]  ───>  [Prod workloads]│
│  - DRY modules             - Secure KMS keys           - High avail    │
│  - CI/CD pipelines         - GuardDuty monitoring      - Cost optimized│
└────────────────────────────────────────────────────────────────────────┘
`,
      details: [
        {
          tabTitle: "Overview",
          content: "At Storm Reply, Giulio designed and implemented mission-critical AWS architectures for enterprise-level clients. He collaborated in a highly professional, agile environment, creating reusable, secure, and compliant Terraform modules. His work covered transit networking, central auditing, and infrastructure hardening to prevent data leaks or unauthorized resource allocation."
        },
        {
          tabTitle: "Modular IaC",
          content: "<strong>Enterprise Terraform library design:</strong><br><br>• <strong>Modular architecture:</strong> developed standardized, version-controlled Terraform modules for S3, VPCs, KMS, and IAM.<br>• <strong>Security baselines:</strong> built-in default encryption, object ownership enforcement, and audit logging.<br>• <strong>Automated testing & docs:</strong> integrated terraform-docs and validation hooks into CI/CD pipelines to simplify developer adoption."
        }
      ]
    }
  },
  {
    id: "zero12",
    title: "VarGroup AWS Tech Lead",
    npcName: "VarGroup Tech Lead",
    npcSprite: "engineer",
    shortDescription: "Giulio's current fully remote role as an AWS Tech Lead at VarGroup (which acquired Zero12), designing secure enterprise landing zones and automated serverless pipelines.",
    dialogue: [
      "Hey! Welcome to the VarGroup milestone. Giulio works fully remote for us as an AWS Tech Lead.",
      "VarGroup acquired Zero12, where Giulio first joined to design cloud-native migrations and data lakes.",
      "In his role, he leads the modularization of enterprise AWS landing zones with automated guardrails for ISO 27001 and NIS2 compliance.",
      "Through reusable Terraform/CDK modules and FinOps refactoring, he has cut auditing time by 75% and wasteful cloud spend by 20%."
    ],
    deepDive: {
      architectureDiagram: `
┌────────────────────────────────────────────────────────────────────────┐
│                         ZERO12 CLOUD ADOPTION                          │
├────────────────────────────────────────────────────────────────────────┤
│  [Assessment]        ───>  [Architecture design] ───>  [Migration run] │
│  - TCO review              - Serverless first          - Zero downtime │
│  - Cloud readiness         - Multi-account IaC         - Post-golive   │
└────────────────────────────────────────────────────────────────────────┘
`,
      details: [
        {
          tabTitle: "Overview",
          content: "At Zero12, Giulio acts as a senior technical reference for AWS Cloud deployments. His role involves advising on enterprise cloud-native migrations, designing cost-efficient serverless systems, enforcing security policies, and leading engineering teams to build modular cloud infrastructure. He integrates his specialized 'data expert' background to empower local and international businesses."
        },
        {
          tabTitle: "Serverless migration",
          content: "<strong>Serverless API routing & security:</strong><br><br>• <strong>API Gateway & Cognito:</strong> built secured REST APIs enforcing JWT token authorization on every incoming request.<br>• <strong>Microservices pattern:</strong> isolated AWS Lambda functions per domain boundary for independent scaling and deployment.<br>• <strong>FinOps refactoring:</strong> transitioned legacy always-on compute instances to serverless pay-per-use architecture, cutting cloud spend by 20%."
        }
      ]
    }
  },
  {
    id: "high-school",
    title: "Liceo Linguistico C#",
    npcName: "Linguist Giulio",
    npcSprite: "developer",
    shortDescription: "Giulio's early programming roots at a linguistic high school in Grosseto, where he self-taught C and C# at age 15 to build simple utilities.",
    dialogue: [
      "Bonjour! Ciao! Welcome to the early memory lane.",
      "Giulio actually went to a linguistic high school, Liceo Linguistico A. Rosmini in Grosseto.",
      "Studying grammar and human languages sparked his interest in how computer languages work!",
      "When he was 15, he taught himself C and C# to build small desktop apps, like a simple Latin declension solver.",
      "Studying translation actually built the analytical mindset that he still uses in cloud engineering today."
    ],
    deepDive: {
      architectureDiagram: `
┌────────────────────────────────────────────────────────────────────────┐
│                        EARLY HACKER MINDSET (C)                        │
├────────────────────────────────────────────────────────────────────────┤
│  [Latin declension solver]  ───>  [Self-taught C/C#]  ───> [CS career] │
│  - Dynamic rule matches          - System forms            - Pisa Uni  │
│  - Case ending parsing           - Custom web browser      - AWS expert│
└────────────────────────────────────────────────────────────────────────┘
`,
      details: [
        {
          tabTitle: "Overview",
          content: "Before diving into formal Computer Science, Giulio loved the structural logic of languages. At Liceo Linguistico, he realized programming languages were just another medium for expression. At 15, he self-taught C and C# to build useful utilities, such as a Latin declension solver and a custom web browser, building the strong independent hacker mindset he carries today."
        },
        {
          tabTitle: "Early C script",
          content: "<strong>Early programming & hacker mindset:</strong><br><br>• <strong>Self-taught fundamentals:</strong> taught himself C and C# at age 15 while attending Liceo Linguistico in Grosseto.<br>• <strong>Latin declension solver:</strong> built a retro desktop application in C that parsed noun bases and conjugated Latin declension endings.<br>• <strong>Linguistic foundation:</strong> translating human languages (Latin, English, French) built the analytical structure that now fuels his cloud architecture mindset."
        }
      ]
    }
  },
  {
    id: "tech-advisor",
    title: "AI technical advisor",
    npcName: "Technical Advisor",
    npcSprite: "architect",
    shortDescription: "A friendly AI Technical Advisor, introducing Giulio's broad experience across cloud networking, backend coding, and data engineering.",
    dialogue: [
      "Hey! Welcome to the Projects Center. I'm here to give you a quick overview.",
      "Giulio is an AWS Tech Lead who enjoys working across multiple domains instead of staying in a single, isolated silo.",
      "He likes to understand how things connect end-to-end—whether that's writing Terraform for a multi-account cloud network, scripting serverless Python pipelines, or building a web app frontend.",
      "He believes that having a good grasp of both software development and infrastructure leads to much cleaner, more reliable systems.",
      "To see some of his projects, walk up to the display console right behind me and press Space or Enter!"
    ],
    deepDive: null
  },
  {
    id: "azzurra",
    title: "Azzurra",
    npcName: "Azzurra",
    npcSprite: "azzurra",
    shortDescription: "Giulio's supportive fiancé, Azzurra.",
    dialogue: [
      "Hi! Are you here to check out Giulio's portfolio?",
      "Honestly, even after all these years, I still just see a bunch of terminal windows and cloud diagrams on his three monitors...",
      "But whenever his friends or colleagues have a tricky cloud issue or some weird bug, they always message him because he just loves figuring things out.",
      "I'm really proud of him! Enjoy looking around our little town!"
    ],
    deepDive: null
  },
  {
    id: "leone",
    title: "Leone",
    npcName: "Leone",
    npcSprite: "leone",
    shortDescription: "Giulio's lovely Pomeranian dog, Leone.",
    dialogue: [
      "Woof! Woof!",
      "Grrr... Woof! Woof!"
    ],
    deepDive: null
  },
  {
    id: "town-guide",
    title: "Town guide",
    npcName: "Town Guide",
    npcSprite: "architect",
    shortDescription: "A friendly guide helping you navigate the town.",
    dialogue: [
      "Hey, welcome! I'm here to help you get your bearings around town.",
      "To the left is the Projects Center, where you can see his cloud designs.",
      "Straight ahead is the Career Journey, showing how he got into tech.",
      "And to the right is the Contact Lounge if you want to reach out to him.",
      "Have fun exploring!"
    ],
    deepDive: null
  },
  {
    id: "recruiter-npc",
    title: "Tech recruiter",
    npcName: "Tech Recruiter",
    npcSprite: "engineer",
    shortDescription: "A friendly tech recruiter checking out Giulio's profile.",
    dialogue: [
      "Hey there! Are you a recruiter too?",
      "I'm checking out Giulio's profile. He has a really nice balance of cloud architecture, infrastructure-as-code, and serverless coding.",
      "It's great to find someone who is focused on security, infrastructure automation, and compliance, I feel like I can trust he'd be a perfect fit for our team.",
      "Actually, I'm heading over to his Contact lounge right now. Would you like to come with me?"
    ],
    deepDive: null
  }
];
