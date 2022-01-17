
**NAME**

RemSegment - Removes a resident segment from the resident list (V36)

**SYNOPSIS**

```c
    success = RemSegment(segment)
    D0                      D1

    BOOL RemSegment(struct Segment *)

```
Links: [Segment](_0078.md) 

**FUNCTION**

Removes a resident segment from the Dos resident segment list,
unloads it, and does any other cleanup required.  Will only succeed
if the seg_UC (usecount) is 0.

**INPUTS**

segment - the segment to be removed

RESULT
success - success or failure.

**SEE ALSO**

[FindSegment](FindSegment.md), [AddSegment](AddSegment.md)
