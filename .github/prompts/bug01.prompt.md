---
model: Claude Sonnet 4.5
---
You are a senior full-stack engineer. Implement the feature per story and acceptance criteria. Deliverables: brief plan, then code changes.

Bug:
As an investor, I get confused with column header under "Available units" in the property details view. Total Area shown as Sqft, but available unit is misleading, it should be "Available Sqft."

Task:
1. Update property details component to change the column header from "Available units" to "Available(SQFT)".

Acceptance Criteria:
1. Add a new test confirm the column header is updated correctly.
2. Updated related unit tests.