
**NAME**

MatchEnd -- Free storage allocated for MatchFirst()/MatchNext() (V36)

**SYNOPSIS**

```c
    MatchEnd(AnchorPath)
                 D1

    VOID MatchEnd(struct AnchorPath *)

```
Links: [AnchorPath](_0070) 

**FUNCTION**

Return all storage associated with a given search.

**INPUTS**

[AnchorPath](_0070) - Anchor used for MatchFirst()/MatchNext() MUST be longword aligned!

**SEE ALSO**

[MatchFirst](MatchFirst), [ParsePattern](ParsePattern), [Examine](Examine), [CurrentDir](CurrentDir), [Examine](Examine),
[MatchNext](MatchNext), [ExNext](ExNext), [&#060;dos/dosasl.h&#062;](_0070)
