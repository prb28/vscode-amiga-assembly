
**NAME**

MatchNext - Finds the next file or directory that matches pattern (V36)

**SYNOPSIS**

```c
    error = MatchNext(AnchorPath)
    D0                    D1

    LONG MatchNext(struct AnchorPath *)

```
Links: [AnchorPath](_0070) 

**FUNCTION**

Locates the next file or directory that matches a given pattern.
See [&#060;dos/dosasl.h&#062;](_0070) for more information.  Various bits in the flags
allow the application to control the operation of MatchNext().

See [MatchFirst](MatchFirst) for other notes.

**INPUTS**

[AnchorPath](_0070) - Place holder for search.  MUST be longword aligned!

RESULT
error - 0 for success or error code.  (Opposite of most Dos calls)

BUGS
See [MatchFirst](MatchFirst).

**SEE ALSO**

[MatchFirst](MatchFirst), [ParsePattern](ParsePattern), [Examine](Examine), [CurrentDir](CurrentDir), [Examine](Examine),
[MatchEnd](MatchEnd), [ExNext](ExNext), [&#060;dos/dosasl.h&#062;](_0070)
