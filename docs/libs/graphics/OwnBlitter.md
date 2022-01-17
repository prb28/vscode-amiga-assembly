
**NAME**

OwnBlitter -- get the blitter for private usage

**SYNOPSIS**

```c
    OwnBlitter()

    void OwnBlitter( void );

```
**FUNCTION**

If blitter is available return immediately with the blitter
locked for your exclusive use. If the blitter is not available
put task to sleep. It will be awakened as soon as the blitter
is available. When the task first owns the blitter the blitter
may still be finishing up a blit for the previous owner. You
must do a [WaitBlit](WaitBlit.md) before actually using the blitter registers.

Calls to OwnBlitter() do not nest. If a task that owns the
blitter calls OwnBlitter() again, a lockup will result.
(Same situation if the task calls a system function
that tries to own the blitter).

**INPUTS**

NONE

RETURNS
NONE

**SEE ALSO**

[DisownBlitter](DisownBlitter.md) [WaitBlit](WaitBlit.md)
