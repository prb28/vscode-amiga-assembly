
**NAME**

Supervisor -- trap to a short supervisor mode function

**SYNOPSIS**

```c
    result = Supervisor(userFunc)
    Rx                   A5

    ULONG Supervisor(void *);

```
**FUNCTION**

Allow a normal user-mode program to execute a short assembly language
function in the supervisor mode of the processor.  Supervisor() does
not modify or save registers; the user function has full access to the
register set.   All rules that apply to interrupt code must be
followed.  In addition, no system calls are permitted.  The function
must end with an RTE instruction.

EXAMPLE
;Obtain the Exception Vector base.  68010 or greater only!
MOVECtrap:      movec.l VBR,d0  ;$4e7a,$0801
rte

**INPUTS**

userFunc - A pointer to a short assembly language function ending
in RTE.  The function has full access to the register set.

**RESULTS**

result   - Whatever values the userFunc left in the registers.

**SEE ALSO**

[SuperState](SuperState),[UserState](UserState)
