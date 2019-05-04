
**NAME**

MatchFirst -- Finds file that matches pattern (V36)

**SYNOPSIS**

```c
    error = MatchFirst(pat, AnchorPath)
    D0                 D1       D2

    LONG MatchFirst(STRPTR, struct AnchorPath *)

```
Links: [AnchorPath](_0070) 

**FUNCTION**

Locates the first file or directory that matches a given pattern.
MatchFirst() is passed your pattern (you do not pass it through
[ParsePattern](ParsePattern) - MatchFirst() does that for you), and the control
structure.  MatchFirst() normally initializes your [AnchorPath](_0070)
structure for you, and returns the first file that matched your
pattern, or an error.  Note that <a href="../Includes_and_Autodocs_2._guide/node02CE.html">MatchFirst()/MatchNext() are unusual
for Dos in that they return 0 for success, or the error code (see
[&#060;dos/dos.h&#062;](_0068)), instead of the application getting the error code
from [IoErr](IoErr).

When looking at the result of <a href="../Includes_and_Autodocs_2._guide/node02CE.html">MatchFirst()/MatchNext(), the ap_Info
field of your [AnchorPath](_0070) has the results of an [Examine](Examine) of the object.
You normally get the name of the object from fib_FileName, and the
directory it's in from ap_Current-&#062;an_Lock.  To access this object,
normally you would temporarily [CurrentDir](CurrentDir) to the lock, do an action
to the file/dir, and then [CurrentDir](CurrentDir) back to your original directory.
This makes certain you affect the right object even when two volumes
of the same name are in the system.  You can use ap_Buf (with
ap_Strlen) to get a name to report to the user.

To initialize the [AnchorPath](_0070) structure (particularily when reusing
it), set ap_BreakBits to the signal bits (CDEF) that you want to take
a break on, or NULL, if you don't want to convenience the user.
ap_Flags should be set to any flags you need or all 0's otherwise.
ap_FoundBreak should be cleared if you'll be using breaks.

If you want to have the FULL PATH NAME of the files you found,
allocate a buffer at the END of this structure, and put the size of
it into ap_Strlen.  If you don't want the full path name, make sure
you set ap_Strlen to zero.  In this case, the name of the file, and
stats are available in the ap_Info, as per usual.

Then call MatchFirst() and then afterwards, [MatchNext](MatchNext) with this
structure.  You should check the return value each time (see below)
and take the appropriate action, ultimately calling [MatchEnd](MatchEnd) when
there are no more files or you are done.  You can tell when you are
done by checking for the normal AmigaDOS return code
ERROR_NO_MORE_ENTRIES.

Note: patterns with trailing slashes may cause <a href="../Includes_and_Autodocs_2._guide/node02CE.html">MatchFirst()/MatchNext()
to return with an ap_Current-&#062;an_Lock on the object, and a filename
of the empty string (&#034;&#034;).

See [ParsePattern](ParsePattern) for more information on the patterns.

**INPUTS**

pat        - Pattern to search for
[AnchorPath](_0070) - Place holder for search.  MUST be longword aligned!

RESULT
error - 0 for success or error code.  (Opposite of most Dos calls!)

BUGS
In V36, there were a number of bugs with <a href="../Includes_and_Autodocs_2._guide/node02CE.html">MatchFirst()/MatchNext().
One was that if you entered a directory with a name like &#034;df0:l&#034;
using DODIR, it would re-lock the full string &#034;df0:l&#034;, which can
cause problems if the disk has changed.  It also had problems
with patterns such as #?/abc/def - the ap_Current-&#062;an_Lock would
not be on the directory def is found in.  ap_Buf would be correct,
however.  It had similar problems with patterns with trailing
slashes.  These have been fixed for V37 and later.

A bug that has not been fixed for V37 concerns a pattern of a
single directory name (such as &#034;l&#034;).  If you enter such a directory
via DODIR, it re-locks l relative to the current directory.  Thus
you must not change the current directory before calling [MatchNext](MatchNext)
with DODIR in that situation.  If you aren't using DODIR to enter
directories you can ignore this.  This may be fixed in some upcoming
release.

**SEE ALSO**

[MatchNext](MatchNext), [ParsePattern](ParsePattern), [Examine](Examine), [CurrentDir](CurrentDir), [Examine](Examine),
[MatchEnd](MatchEnd), [ExNext](ExNext), [&#060;dos/dosasl.h&#062;](_0070)
