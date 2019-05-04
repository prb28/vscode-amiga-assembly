
**NAME**

LockPubScreenList -- Prevent changes to the system list. (V36)

**SYNOPSIS**

```c
    List = LockPubScreenList()
    D0

    struct List *LockPubScreenList( VOID );

```
Links: [List](_007D) [List](_007D) 

**FUNCTION**

Arbitrates access to public screen list while you quickly
make a copy of it for display to the user.

Note that this is intended only for the Public [Screen](_00DD) Manager
program.

NOTES
The nodes on the list are [PubScreenNode](_00DD) structures.
Act quickly while holding this lock.  The restrictions
on [LockIBase](LockIBase) apply here as well.

**INPUTS**

None.

RESULT
A pointer to the public screen list.

BUGS

**SEE ALSO**

[OpenScreen](OpenScreen), Intuition V36 update documentation
