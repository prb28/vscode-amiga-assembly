
**NAME**

LockPubScreenList -- Prevent changes to the system list. (V36)

**SYNOPSIS**

```c
    List = LockPubScreenList()
    D0

    struct List *LockPubScreenList( VOID );

```
Links: [List](_007D.md) [List](_007D.md) 

**FUNCTION**

Arbitrates access to public screen list while you quickly
make a copy of it for display to the user.

Note that this is intended only for the Public [Screen](_00DD.md) Manager
program.

NOTES
The nodes on the list are [PubScreenNode](_00DD.md) structures.
Act quickly while holding this lock.  The restrictions
on [LockIBase](LockIBase.md) apply here as well.

**INPUTS**

None.

RESULT
A pointer to the public screen list.

BUGS

**SEE ALSO**

[OpenScreen](OpenScreen.md), Intuition V36 update documentation
