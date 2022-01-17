
**NAME**

ParsePatternNoCase -- Create a tokenized string for
[MatchPatternNoCase](MatchPatternNoCase.md) (V37)

**SYNOPSIS**

```c
    IsWild = ParsePatternNoCase(Source, Dest, DestLength)
    d0                            D1     D2      D3

    LONG ParsePatternNoCase(STRPTR, STRPTR, LONG)

```
**FUNCTION**

Tokenizes a pattern, for use by [MatchPatternNoCase](MatchPatternNoCase.md).  Also indicates
if there are any wildcards in the pattern (i.e. whether it might match
more than one item).  Note that Dest must be at least 2 times as
large as Source plus 2 bytes.

For a description of the wildcards, see [ParsePattern](ParsePattern.md).

**INPUTS**

source     - unparsed wildcard string to search for.
dest       - output string, gets tokenized version of input.
DestLength - length available in destination (should be at least as
twice as large as source + 2 bytes).

RESULT
IsWild - 1 means there were wildcards in the pattern,
0 means there were no wildcards in the pattern,
-1 means there was a buffer overflow or other error

BUGS
Should set [IoErr](IoErr.md) to something useful (not currently set) on an
error.

**SEE ALSO**

[ParsePattern](ParsePattern.md), [MatchPatternNoCase](MatchPatternNoCase.md), [MatchFirst](MatchFirst.md), [MatchNext](MatchNext.md)
