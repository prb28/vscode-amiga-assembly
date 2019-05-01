
**NAME**

RawDoFmt -- format data into a character stream.

**SYNOPSIS**

```c
    NextData = RawDoFmt(FormatString, DataStream, PutChProc, PutChData);
   d0                  a0            a1          a2         a3

    APTR RawDoFmt(STRPTR,APTR,void (*)(),APTR);

```
**FUNCTION**

perform &#034;C&#034;-language-like formatting of a data stream, outputting
the result a character at a time.  Where % formatting commands are
found in the FormatString, they will be replaced with the
corresponding element in the DataStream.  %% must be used in the
string if a % is desired in the output.

Under V36, RawDoFmt() returns a pointer to the end of the DataStream
(The next argument that would have been processed).  This allows
multiple formatting passes to be made using the same data.

**INPUTS**

FormatString - a &#034;C&#034;-language-like NULL terminated format string,
with the following supported % options:

%[flags][width.limit][length]type

flags  - only one allowed. '-' specifies left justification.
width  - field width.  If the first character is a '0', the
field will be padded with leading 0's.
.    - must follow the field width, if specified
limit  - maximum number of characters to output from a string.
(only valid for %s).
length - size of input data defaults to WORD for types d, x,
and c, 'l' changes this to long (32-bit).
type   - supported types are:
b - BSTR, data is 32-bit BPTR to byte count followed
by a byte string, or NULL terminated byte string.
A NULL BPTR is treated as an empty string.
(Added in V36 exec)
d - decimal
u - unsigned decimal (Added in V37 exec)
x - hexadecimal
s - string, a 32-bit pointer to a NULL terminated
byte string.  In V36, a NULL pointer is treated
as an empty string
c - character

DataStream - a stream of data that is interpreted according to
the format string.  Often this is a pointer into
the task's stack.
PutChProc  - the procedure to call with each character to be
output, called as:

PutChProc(Char,  PutChData);
D0-0:8 A3

the procedure is called with a NULL Char at the end of
the format string.

PutChData - a value that is passed through to the PutChProc
procedure.  This is untouched by RawDoFmt, and may be
modified by the PutChProc.

EXAMPLE
;
; Simple version of the C &#034;sprintf&#034; function.  Assumes C-style
; stack-based function conventions.
;
;   long eyecount;
;   eyecount=2;
;   sprintf(string,&#034;%s have %ld eyes.&#034;,&#034;Fish&#034;,eyecount);
;
; would produce &#034;Fish have 2 eyes.&#034; in the string buffer.
;
XDEF _sprintf
XREF _AbsExecBase
XREF _LVORawDoFmt
_sprintf:       ; ( ostring, format, {values} )
movem.l a2/a3/a6,-(sp)

move.l  4*4(sp),a3       ;Get the output string pointer
move.l  5*4(sp),a0       ;Get the FormatString pointer
lea.l   6*4(sp),a1       ;Get the pointer to the DataStream
lea.l   stuffChar(pc),a2
move.l  _AbsExecBase,a6
jsr     _LVORawDoFmt(a6)

movem.l (sp)+,a2/a3/a6
rts

;------ PutChProc function used by RawDoFmt -----------
stuffChar:
move.b  d0,(a3)+        ;Put data to output string
rts

**WARNING**

This Amiga ROM function formats word values in the data stream.  If
your compiler defaults to longs, you must add an &#034;l&#034; to your
% specifications.  This can get strange for characters, which might
look like &#034;%lc&#034;.

The result of RawDoFmt() is *ONLY* valid in V36 and later releases
of EXEC.  Pre-V36 versions of EXEC have &#034;random&#034; return values.

**SEE ALSO**

Documentation on the C language &#034;printf&#034; call in any C language
reference book.
