
**NAME**

OldOpenLibrary -- obsolete [OpenLibrary](file:///docs/libs/exec/OpenLibrary.md)

**SYNOPSIS**
```
library = OldOpenLibrary(libName)
D0                       A1
```
struct [Library](command:vscode.previewHtml?file:///docs/libs/exec/OpenLibrary.md) *OldOpenLibrary(APTR);

**FUNCTION**

The 1.0 release of the Amiga system had an incorrect version of
[OpenLibrary](http://amigadev.elowar.com/read/ADCD_2.1/Includes_and_Autodocs_2._guide/node0367.html) that did not check the version number during the
library open.  This obsolete function is provided so that object
code compiled using a 1.0 system will still run.

This exactly the same as &#034;OpenLibrary(libName,0L);&#034;

**INPUTS**

libName - the name of the library to open

**RESULTS**

library - a library pointer for a successful open, else zero

**SEE ALSO**

[CloseLibrary](/exec:CloseLibrary)
