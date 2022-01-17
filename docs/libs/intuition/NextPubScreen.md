
**NAME**

NextPubScreen -- Identify next public screen in the cycle. (V36)

**SYNOPSIS**

```c
    Buff = NextPubScreen( Screen, NameBuff )
    D0                    A0      A1

    UBYTE *NextPubScreen( struct Screen *, UBYTE * );

```
Links: [Screen](_00DD.md) [Screen](_00DD.md) 

**FUNCTION**

Returns name of next public screen in system rotation, to
allow visitor windows to provide function to &#034;jump&#034; among
public-screens in a cycle.

**INPUTS**

[Screen](_00DD.md) = pointer to the screen your window is currently open in,
or NULL, if you don't have a pointer to a public screen.
NameBuff = pointer to a buffer of MAXPUBSCREENNAME+1 characters,
for Intuition to fill in with the name of the next public
screen in rotation.

RESULT
Returns NULL if there are no public screens, otherwise a
pointer to your NameBuff.

NOTES
There is no guarantee that the public screen whose name
was returned by this function will exist or be in &#034;public&#034; state
by the time you call [LockPubScreen](LockPubScreen.md), etc.  You must handle
cases where [LockPubScreen](LockPubScreen.md), etc. will fail.

BUGS
Due to a bug, your buffer needs to be (MAXPUBSCREENNAME + 1)
characters big, which is one more than originally documented.

The starting screen and cycle order of the public screens isn't
defined, so do not draw conclusions about the order you
see in the current version of Intuition.  We reserve the
right to add meaning to the ordering at a future time.

**SEE ALSO**

[OpenScreen](OpenScreen.md), Intuition V36 update documentation
