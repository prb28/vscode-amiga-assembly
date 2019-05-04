
**NAME**

AddSegment - Adds a resident segment to the resident list (V36)

**SYNOPSIS**

```c
    success = AddSegment(name, seglist, type)
    D0                    D1     D2      D3

    BOOL AddSegment(STRPTR, BPTR, LONG)

```
**FUNCTION**

Adds a segment to the Dos resident list, with the specified Seglist
and type (stored in seg_UC - normally 0).  NOTE: currently unused
types may cause it to interpret other registers (d4-?) as additional
parameters in the future.

Do NOT build [Segment](_0078) structures yourself!

**INPUTS**

name    - name for the segment
seglist - Dos seglist of code for segment
type    - initial usecount, normally 0

RESULT
success - success or failure

**SEE ALSO**

[FindSegment](FindSegment), [RemSegment](RemSegment), [LoadSeg](LoadSeg)
