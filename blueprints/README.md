# Blueprints

Blueprints are design concepts and proposals for the Infor Design System. The purpose is to gather feedback and share upcoming plans as they develop. This way, we can foster conversation and together implement the best features possible for the design system.

## When to use a Blueprint

Many changes to the Infor Design System, including bug fixes and documentation improvements, can be implemented and reviewed via the normal GitHub pull request workflow.

Some changes, though, are "substantial", and we ask that these be put through a bit of a design process and produce a consensus among the IDS core team.

The blueprint process is intended to provide a consistent and controlled path for new features to enter the Design System.

## Process

- To create a new blueprint, copy the template below and create a new file like `000-my-design-concept.md` in the `/blueprints` folder. Leave the number as `000` since we'll assign a number later.
- Fill in the blueprint. Put care into the details: **blueprints that do not present convincing motivation, demonstrate understanding of the impact of the design, or are disingenuous about the drawbacks or alternatives tend to be poorly-received**.
- Submit a pull request. As a pull request the blueprint will receive design feedbacks from the larger community, and the author should be prepared to revise it in response.
- Build consensus and integrate feedback. Blueprints that have broad support are much more likely to make progress than those that don't receive any comments.
- Eventually, the core team will decide whether the blueprint is a candidate for inclusion in the Infor Design System.
- Blueprints that are candidates for inclusion in IDS will enter a "final comment period" lasting 10 days. The beginning of this period will be signaled with a comment and tag on the blueprint's pull request. Furthermore, the blueprint will be advertised widely (for example, it may be posted in a newsletter or chat channels).
- A blueprint can be modified based upon feedback from the core team and community. Significant modifications may trigger a new final comment period.
- A blueprint may be rejected by the core team after public discussion has settled and comments have been made summarizing the rationale for rejection. A member of the core team should then close the blueprint's associated pull request.
- A blueprint may be accepted at the close of its final comment period. A core team member will merge the blueprint's associated pull request, at which point the blueprint will become 'active'.

### The Blueprint Lifecycle

Once a blueprint becomes active then authors may implement it and submit the feature as a pull request to the appropriate IDS repo. Becoming 'active' is not a rubber stamp, and in particular still does not mean the feature will ultimately be merged; it does mean that the core team has agreed to it in principle and are amenable to merging it.

Furthermore, the fact that a given blueprint has been accepted and is 'active' implies nothing about what priority is assigned to its implementation, nor whether anybody is currently working on it.

Modifications to active blueprints can be done in follow-up PRs. We strive to write each blueprint in a manner that it will reflect the final design of the feature; but the nature of the process means that we cannot expect every merged blueprint to actually reflect what the end result will be at the time of the next major release; therefore we try to keep each blueprint document somewhat in sync with the language feature as planned, tracking such changes via follow-up pull requests to the document.

### Implementing a Blueprint

The author of a blueprint is not obligated to implement it. Of course, the blueprint author (like any other designer or developer) is welcome to post an implementation for review after the blueprint has been accepted.

If you are interested in working on the implementation for an 'active' blueprint, but cannot determine if someone else is already working on it, feel free to ask (e.g. by leaving a comment on the associated issue).

### Reviewing Blueprints

Each week the core team will attempt to review some set of open blueprint pull requests.

## Template

The layout for a blueprint will change based on the feature but generally can follow what's below:

```txt
# Blueprint 1: Purpose and format

* Blueprint: 1
* Author: Nick Wynja
* Created: 2019-01-29
* Last Modified: 2019-01-29

## Abstract

Provides a short description of the purpose of the feature and the functionality it will deliver, including the reasons why it is desirable.

## Specification (if technical feature)

The technical specification should describe the syntax and semantics of any new feature. The specification should be detailed enough to allow implementation -- that is, developers other than the author should (given the right experience) be able to independently implement the feature, given only the blueprint.

Include subheadings as necessary.

### Sub-headings 1


### Sub-heading n

## Impacts

What other things in the system does this or could this change impact?

## Rollout

How might this change be rolled out in the system?

## Open Questions

// Include any questions until Status is ‘Accepted’
```

---

The Infor Design System's blueprint process is inspired by the [Wagtail](https://github.com/wagtail/rfcs) and [Rust](https://github.com/rust-lang/rfcs) RFC process.
