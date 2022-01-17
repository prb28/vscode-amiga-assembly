
**NAME**

MatchNext - Finds the next file or directory that matches pattern (V36)

**SYNOPSIS**

```c
    error = MatchNext(AnchorPath)
    D0                    D1

    LONG MatchNext(struct AnchorPath *)

```
Links: [AnchorPath](_0070.md) 

**FUNCTION**

Locates the next file or directory that matches a given pattern.
See [&#060;dos/dosasl.h&#062;](_0070.md) for more information.  Various bits in the flags
allow the application to control the operation of MatchNext().

See [MatchFirst](MatchFirst.md) for other notes.

**INPUTS**

[AnchorPath](_0070.md) - Place holder for search.  MUST be longword aligned!

RESULT
error - 0 for success or error code.  (Opposite of most Dos calls)

BUGS
See [MatchFirst](MatchFirst.md).

**SEE ALSO**

[MatchFirst](MatchFirst.md), [ParsePattern](ParsePattern.md), [Examine](Examine.md), [CurrentDir](CurrentDir.md), [Examine](Examine.md),
[MatchEnd](MatchEnd.md), [ExNext](ExNext.md), [&#060;dos/dosasl.h&#062;](_0070.md)
