
**NAME**

ParsePattern -- Create a tokenized string for [MatchPattern](MatchPattern) (V36)

**SYNOPSIS**

```c
    IsWild = ParsePattern(Source, Dest, DestLength)
    d0                      D1     D2      D3

    LONG ParsePattern(STRPTR, STRPTR, LONG)

```
**FUNCTION**

Tokenizes a pattern, for use by [MatchPattern](MatchPattern).  Also indicates if
there are any wildcards in the pattern (i.e. whether it might match
more than one item).  Note that Dest must be at least 2 times as
large as Source plus bytes to be (almost) 100% certain of no
buffer overflow.  This is because each input character can currently
expand to 2 tokens (with one exception that can expand to 3, but
only once per string).  Note: this implementation may change in
the future, so you should handle error returns in all cases, but
the size above should still be a reasonable upper bound for a buffer
allocation.

The patterns are fairly extensive, and approximate some of the ability
of Unix/grep &#034;regular expression&#034; patterns.  Here are the available
tokens:

?       Matches a single character.
#       Matches the following expression 0 or more times.
(ab|cd) Matches any one of the items seperated by '|'.
~       Negates the following expression.  It matches all strings
that do not match the expression (aka ~(foo) matches all
strings that are not exactly &#034;foo&#034;).
[abc]   Character class: matches any of the characters in the class.
[~bc]   Character class: matches any of the characters not in the
class.
a-z     Character range (only within character classes).
%       Matches 0 characters always (useful in &#034;(foo|bar|%)&#034;).
*       Synonym for &#034;#?&#034;, not available by default in 2.0.  Available
as an option that can be turned on.

&#034;Expression&#034; in the above table means either a single character
(ex: &#034;#?&#034;), or an alternation (ex: &#034;#(ab|cd|ef)&#034;), or a character
class (ex: &#034;#[a-zA-Z]&#034;).

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
Should set [IoErr](IoErr) to something useful (not currently set) on an
error.

**SEE ALSO**

[ParsePatternNoCase](ParsePatternNoCase), [MatchPattern](MatchPattern), [MatchFirst](MatchFirst), [MatchNext](MatchNext)
