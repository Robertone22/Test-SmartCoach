# AI Usage Report

## Project: SmartCoach

## Course: MDS — Metode de Dezvoltare Software

## Date: June 2026

---

## Overview

SmartCoach was developed with extensive use of AI tools during all major phases of the software development process:

* project planning
* backlog and user story refinement
* frontend implementation
* backend implementation
* AI agent design
* testing and evaluation design
* Docker and CI/CD configuration
* documentation
* diagram creation and refinement
* presentation preparation

The main purpose of the project was not only to build a functional fitness web application, but also to demonstrate how AI tools can support the full software development lifecycle.

Most of the boilerplate code, documentation structure, backend scaffolding, tests, evals and diagrams were generated or heavily assisted by AI tools. The team reviewed, tested and corrected the generated output before including it in the final repository.

---

## Tools Used

### 1. Antigravity — Claude / Gemini-based coding assistant

**Primary tool for implementation and repository transformation.**

Antigravity was used as the main AI coding assistant for converting the initial SmartCoach frontend into a more complete full-stack application.

Used for:

* generating the local Node.js + Express + TypeScript backend
* replacing Firebase runtime dependency with a local REST API demo flow
* rewriting `AuthContext.tsx` and `AppContext.tsx`
* creating the frontend API service layer in `src/services/api.ts`
* creating the PostgreSQL database schema and seed data
* implementing local authentication and demo login
* implementing workout CRUD operations
* implementing progress / weight tracking operations
* designing and implementing the two AI agent services:

  * `workout-agent.service.ts`
  * `nutrition-agent.service.ts`
* adding deterministic fallback logic for both AI agents
* adding optional Groq API integration
* generating backend tests using Vitest and Supertest
* creating eval files for both agents
* writing Docker and Docker Compose configuration
* generating the GitHub Actions CI/CD pipeline
* generating the initial MDS documentation structure
* drafting README sections and local run instructions

**Prompt strategy used:**

* The team provided the full project context before asking for major changes.
* Prompts included explicit technical constraints:

  * do not rewrite the app from scratch
  * preserve the existing frontend structure
  * replace Firebase with a local backend for the demo
  * keep the application runnable locally
  * implement two product-level AI agents
  * include deterministic fallback behavior
  * avoid committing real API keys
* Large tasks were split into smaller follow-up prompts when issues appeared.

**Human oversight:**

* The team manually tested the app after AI-generated changes.
* The team verified Docker Compose startup.
* The team checked the login and demo login flow.
* The team identified and corrected styling/Tailwind configuration issues.
* The team reviewed generated diagrams and replaced overly complex ones with simpler Mermaid diagrams.
* The team checked that `.env` files and API keys were not committed.

---

### 2. ChatGPT — OpenAI

**Used for planning, debugging, documentation refinement and presentation preparation.**

ChatGPT was used as a second AI assistant, mostly for higher-level reasoning and project organization.

Used for:

* interpreting the official MDS requirements
* comparing the repository structure with a strong example project
* defining the repository checklist for the final submission
* planning the branch / issue / pull request workflow
* explaining how to use GitHub Issues, Pull Requests and code review
* creating better prompts for Antigravity
* debugging local setup issues step by step
* explaining Docker and Docker Compose usage
* explaining why the frontend should not expose API keys
* improving the AI agent workflow diagrams
* rewriting Mermaid diagrams to be clearer and less cluttered
* improving the AI Usage Report
* preparing possible explanations for the MDS presentation

**Human oversight:**

* The team selected which suggestions were relevant.
* The team manually executed Git, Docker and local run commands.
* The team verified the actual behavior of the application in the browser.
* The team decided which documentation should be committed.

---

### 3. Groq API — LLM provider for runtime AI agents

**Used as the optional real LLM provider for the two SmartCoach AI agents.**

Groq was integrated as a backend-only provider. The API key is read from the backend environment and is never exposed in the frontend.

Used for:

* **Workout Coach Agent**

  * generates dynamic workout recommendations
  * uses user profile, goal, activity level, equipment and constraints
  * returns structured workout data

* **Nutrition / Progress Agent**

  * generates dynamic progress and nutrition feedback
  * uses profile data, activity level and weight history
  * returns structured nutrition-oriented feedback

The application is still functional without Groq because both agents include deterministic fallback logic.

**Prompt design decisions:**

* Each agent has a different role and prompt.
* Both agents request structured JSON output.
* The prompts include safety guardrails.
* The nutrition agent avoids medical diagnosis and applies conservative recommendation rules.
* The workout agent avoids unsafe or extreme training advice.

---

### 4. Mermaid Live Editor / GitHub Mermaid Preview

**Used for diagram validation and visual documentation.**

Although Mermaid itself is not an AI model, it was used as part of the AI-assisted documentation workflow.

Used for:

* validating Mermaid syntax
* checking whether GitHub could render the diagrams
* previewing AI-generated diagrams before committing them
* identifying diagrams that were technically valid but visually too cluttered
* simplifying complex AI-generated sequence diagrams into clearer flowcharts
* fixing Mermaid ERD syntax issues

Diagrams were initially generated with AI assistance, then reviewed visually and manually improved for readability.

Main diagrams refined:

* AI Agent Workflow
* Backend Architecture
* Component Architecture
* Use Case Diagram
* Git Workflow

---

## AI-Generated Artifacts

The following project artifacts were created or heavily assisted by AI tools:

| Artifact                       | AI involvement |
| ------------------------------ | -------------- |
| Backend folder structure       | High           |
| Express routes and controllers | High           |
| PostgreSQL schema              | High           |
| Frontend API service layer     | High           |
| Auth context rewrite           | High           |
| App context rewrite            | High           |
| Workout Coach Agent            | High           |
| Nutrition / Progress Agent     | High           |
| Deterministic fallback logic   | High           |
| Agent eval cases               | High           |
| Automated tests                | High           |
| Dockerfile and Docker Compose  | High           |
| GitHub Actions CI/CD           | High           |
| README                         | High           |
| User stories and backlog       | High           |
| Bug reports documentation      | High           |
| Mermaid diagrams               | High           |
| AI Usage Report                | High           |

---

## Limitations and Hallucinations

### Known limitations of AI-generated code

1. **Authentication flow mismatch**

   The first generated version of the demo login endpoint required email and password, even though demo login should work without manual credentials. This required review and correction.

2. **Tailwind / CSS configuration**

   The UI initially loaded without proper styling because the Tailwind/PostCSS setup and Docker build flow needed correction. This was detected manually in the browser.

3. **Docker production build behavior**

   The team observed that the Docker frontend was served through a production build, so changes were not visible until rebuilding the image. This required clarification and documentation.

4. **Mermaid diagram complexity**

   Some generated diagrams were technically valid but visually cluttered. These diagrams were manually reviewed and simplified.

5. **Mermaid ERD syntax**

   The initial backend ERD used database-specific type annotations that GitHub Mermaid did not render correctly. The ERD had to be rewritten with simpler Mermaid-compatible types.

---

### Hallucinations or unsuitable suggestions observed

* The AI initially suggested solutions that were too large for the current project phase.
* Some generated diagrams contained too many nodes and crossing arrows.
* Some documentation text used an incorrect expansion of MDS.
* Some initial percentages in the AI Usage Report underestimated the real amount of AI assistance.
* Some generated instructions assumed that all tests and flows worked before they were manually verified.

These issues were corrected through manual review and iterative prompting.

---

## Estimated AI Assistance vs Human Work

The following table estimates the approximate contribution of AI tools versus direct human work.

The percentages represent assistance in producing the artifact, not responsibility for correctness. The team still reviewed and validated the generated output.

| Phase                         | AI contribution | Human contribution |
| ----------------------------- | --------------: | -----------------: |
| Requirements interpretation   |             80% |                20% |
| Architecture design           |             85% |                15% |
| Backend implementation        |             85% |                15% |
| Frontend API integration      |             80% |                20% |
| Authentication rewrite        |             80% |                20% |
| AI agent logic                |             85% |                15% |
| Deterministic fallback design |             80% |                20% |
| PostgreSQL schema             |             85% |                15% |
| Docker configuration          |             85% |                15% |
| CI/CD pipeline                |             85% |                15% |
| Automated tests               |             85% |                15% |
| Agent evals                   |             90% |                10% |
| Documentation                 |             90% |                10% |
| Mermaid diagrams              |             85% |                15% |
| Debugging support             |             75% |                25% |
| Manual verification           |             25% |                75% |
| Final demo preparation        |             80% |                20% |

---

## Human Contribution

Even though AI tools generated a large part of the code and documentation, the team remained responsible for the final result.

Human work included:

* selecting the project direction
* deciding to replace Firebase with a local backend
* checking that the app runs locally
* testing the Docker setup
* verifying browser behavior
* identifying broken authentication behavior
* validating the diagrams visually
* correcting inaccurate documentation
* making sure no real secrets were committed
* preparing the project for presentation
* deciding what should be included in the final repository

---

## Conclusion

AI tools significantly accelerated the development of SmartCoach.

They were especially useful for:

* generating boilerplate backend code
* creating REST API structure
* designing AI agent services
* writing tests and evals
* producing documentation
* creating Docker and CI/CD configuration
* improving project organization

However, AI was not used blindly. Human review was necessary to detect broken flows, correct documentation mistakes, simplify diagrams and ensure that the project could actually run locally.

The final project demonstrates the main goal of the MDS course: using AI tools as active collaborators throughout the software development process, while keeping human developers responsible for validation, integration and final decisions.
