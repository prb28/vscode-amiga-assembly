
**NAME**

MaxCli -- returns the highest CLI process number possibly in use (V36)

**SYNOPSIS**

```c
    number = MaxCli()
    D0

    LONG MaxCli(void)

```
**FUNCTION**

Returns the highest CLI number that may be in use.  CLI numbers are
reused, and are usually as small as possible.  To find all CLIs, scan
using [FindCliProc](FindCliProc) from 1 to MaxCLI().  The number returned by
MaxCli() may change as processes are created and destroyed.

RESULT
number - The highest CLI number that _may_ be in use.

**SEE ALSO**

[FindCliProc](FindCliProc), [Cli](Cli)
