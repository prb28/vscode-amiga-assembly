
**NAME**

SetEditHook -- Set global processing for string gadgets. (V36)

**SYNOPSIS**

```c
    OldHook = SetEditHook( Hook )
    D0                     A0

    struct Hook *SetEditHook( struct Hook * );

```
Links: [Hook](_012D) [Hook](_012D) [Hook](_012D) 

**FUNCTION**

Sets new global editing hook for string gadgets.

WARNING: This function is wholly untested.  Do *NOT* use
this in a commercial product until further notice.

**INPUTS**

[Hook](_012D) -- A pointer to a struct [Hook](_012D) which determines a function
in your code to be called every time the user types a key.
This is done before control is passed to the gadget custom
editing hook, so effects ALL string gadgets.

RESULT
Returns previous global edit hook structure.

BUGS
Unknown, risky.

**SEE ALSO**

