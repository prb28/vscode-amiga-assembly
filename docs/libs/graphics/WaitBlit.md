
**NAME**

WaitBlit -- Wait for the blitter to be finished before proceeding
with anything else.

**SYNOPSIS**

```c
    WaitBlit()

    void WaitBlit( void );

```
**FUNCTION**

WaitBlit returns when the blitter is idle. This function should
normally only be used when dealing with the blitter in a
synchronous manner, such as when using [OwnBlitter](OwnBlitter.md) and [DisownBlitter](DisownBlitter.md).
WaitBlit does not wait for all blits queued up using [QBlit](QBlit.md) or
[QBSBlit](QBSBlit.md). You should call WaitBlit if you are just about to modify or
free some memory that the blitter may be using.

**INPUTS**

none

RESULT
Your program waits until the blitter is finished.
This routine does not use any the CPU registers.
do/d1/a0/a1 are preserved by this routine.
It may change the condition codes though.

BUGS
When examining bits with the CPU right after a blit, or when freeeing
temorary memory used by the blitter, a WaitBlit() may be required.

Note that many graphics calls fire up the blitter, and let it run.
The CPU does not need to wait for the blitter to finish before
returning.

Because of a bug in agnus (prior to all revisions of fat agnus)
this code may return too soon when the blitter has, in fact, not
started the blit yet, even though BltSize has been written.

This most often occurs in a heavily loaded systen with extended memory,
HIRES, and 4 bitplanes.

WaitBlit currently tries to avoid this agnus problem by testing
the BUSY bit multiple times to make sure the blitter has started.
If the blitter is BUSY at first check, this function busy waits.

This initial hardware bug was fixed as of the first &#034;Fat Agnus&#034; chip,
as used in all A500 and A2000 computers.

Because of a different bug in agnus (currently all revisions thru ECS)
this code may return too soon when the blitter has, in fact, not
stopped the blit yet, even though blitter busy has been cleared.

This most often occurs in a heavily loaded systen with extended memory,
in PRODUCTIVITY mode, and 2 bitplanes.

WaitBlit currently tries to avoid this agnus problem by testing
the BUSY bit multiple times to make sure the blitter has really
written its final word of desination data.

**SEE ALSO**

[OwnBlitter](OwnBlitter.md) [DisownBlitter](DisownBlitter.md) [hardware/blit.h](_00CC.md)
