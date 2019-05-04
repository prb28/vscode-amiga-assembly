
**NAME**

UnlockPubScreen -- Release lock on a public screen. (V36)

**SYNOPSIS**

```c
    UnlockPubScreen( Name, [Screen] )
                     A0    A1

    VOID UnlockPubScreen( UBYTE *, struct Screen * );

```
Links: [Screen](_00DD) 

**FUNCTION**

Releases lock gotten by [LockPubScreen](LockPubScreen).
It is best to identify the locked public screen by
the pointer returned from [LockPubScreen](LockPubScreen).  To do this,
supply a NULL 'Name' pointer and the screen pointer.

In rare circumstances where it would be more convenient to pass
a non-NULL pointer to the public screen name string, the
'Screen' parameter is ignored.

**INPUTS**

Name = pointer to name of public screen.  If Name is NULL,
then argument 'Screen' is used as a direct pointer to
a public screen.
[Screen](_00DD) = pointer to a public screen.  Used only if Name
is NULL.  This pointer MUST have been returned
by [LockPubScreen](LockPubScreen).
It is safe to call UnlockPubScreen() with NULL Name
and [Screen](_00DD) (the function will have no effect).

RESULT

BUGS

**SEE ALSO**

[LockPubScreen](LockPubScreen)
