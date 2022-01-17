
**NAME**

MatchEnd -- Free storage allocated for MatchFirst()/MatchNext() (V36)

**SYNOPSIS**

```c
    MatchEnd(AnchorPath)
                 D1

    VOID MatchEnd(struct AnchorPath *)

```
Links: [AnchorPath](_0070.md) 

**FUNCTION**

Return all storage associated with a given search.

**INPUTS**

[AnchorPath](_0070.md) - Anchor used for MatchFirst()/MatchNext() MUST be longword aligned!

**SEE ALSO**

[MatchFirst](MatchFirst.md), [ParsePattern](ParsePattern.md), [Examine](Examine.md), [CurrentDir](CurrentDir.md), [Examine](Examine.md),
[MatchNext](MatchNext.md), [ExNext](ExNext.md), [&#060;dos/dosasl.h&#062;](_0070.md)
