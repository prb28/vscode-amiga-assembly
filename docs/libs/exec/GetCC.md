
**NAME**

GetCC -- get condition codes in a 68010 compatible way.

**SYNOPSIS**

```c
    conditions = GetCC()
      D0

    UWORD GetCC(void);

```
**FUNCTION**

The 68000 processor has a &#034;MOVE SR,&#060;ea&#062;&#034; instruction which gets a
copy of the processor condition codes.

On the 68010,20 and 30 CPUs, &#034;MOVE SR,&#060;ea&#062;&#034; is privileged.  User
code will trap if it is attempted.  These processors need to use
the &#034;MOVE CCR,&#060;ea&#062;&#034; instruction instead.

This function provides a means of obtaining the CPU condition codes
in a manner that will make upgrades transparent.  This function is
VERY short and quick.

**RESULTS**

conditions - the 680XX condition codes

NOTE
This call is guaranteed to preserve all registers.  This function
may be implemented as code right in the jump table.
