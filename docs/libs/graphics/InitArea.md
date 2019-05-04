
**NAME**


InitArea -- Initialize vector collection matrix

**SYNOPSIS**

```c

    InitArea( areainfo, buffer, maxvectors )
                a0          a1      d0

    void InitArea(struct AreaInfo *, void *, SHORT);

```
Links: [AreaInfo](_00AF) 

**FUNCTION**

This function provides initialization for the vector collection
matrix such that it has a size of (max vectors ).  The size of the
region pointed to by buffer (short pointer) should be five (5) times as
large as maxvectors. This size is in bytes.  Areafills done by using
[AreaMove](AreaMove), [AreaDraw](AreaDraw), and [AreaEnd](AreaEnd) must have enough space allocated in
this table to store all the points of the largest fill. [AreaEllipse](AreaEllipse)
takes up two vectors for every call. If AreaMove/Draw/Ellipse detect
too many vectors going into the buffer they will return -1.

**INPUTS**

areainfo - pointer to [AreaInfo](_00AF) structure
buffer - pointer to chunk of memory to collect vertices
maxvectors - max number of vectors this buffer can hold

RESULT
Pointers are set up to begin storage of vectors done by
[AreaMove](AreaMove), [AreaDraw](AreaDraw), and [AreaEllipse](AreaEllipse).

BUGS

**SEE ALSO**

[AreaEnd](AreaEnd) [AreaMove](AreaMove) [AreaDraw](AreaDraw) [AreaEllipse](AreaEllipse) [graphics/rastport.h](_00AF)
