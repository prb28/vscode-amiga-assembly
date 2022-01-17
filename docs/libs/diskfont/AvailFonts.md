
**NAME**

[AvailFonts](_0102.md) -- Inquire available memory &#038; disk fonts.

**SYNOPSIS**

```c
     error = AvailFonts(buffer, bufBytes, flags);
                        A0      D0        D1

     LONG AvailFonts( struct AvailFontsHeader *buffer, LONG bufBytes,
             ULONG flags );

```
Links: [AvailFontsHeader](_0102.md) 

**FUNCTION**

[AvailFonts](_0102.md) fills a user supplied buffer with the structure,
described below, that contains information about all the
fonts available in memory and/or on disk.  Those fonts
available on disk need to be loaded into memory and opened
via [OpenDiskFont](OpenDiskFont.md), those already in memory are accessed via
[OpenFont](../graphics/OpenFont.md).  The [TextAttr](_00A8.md) structure required by the open calls
is part of the information [AvailFonts](_0102.md) supplies.

When [AvailFonts](_0102.md) fails, it returns the number of extra bytes
it needed to complete the command.  Add this number to your
current buffer size, allocate a new buffer, and try again.

**INPUTS**

buffer - memory to be filled with struct [AvailFontsHeader](_0102.md)
followed by an array of [AvailFonts](_0102.md) elements, which
contains entries for the available fonts and their
names.

bufBytes - the number of bytes in the buffer
flags - AFF_MEMORY is set to search memory for fonts to fill
the structure, AFF_DISK is set to search the disk for
fonts to fill the structure.  AFF_SCALED is set to
not filter out memory fonts that are not designed.
Any combination may be specified.  AFF_TAGGED is set
to fill the buffer with [TAvailFonts](_0102.md) elements instead
of [AvailFonts](_0102.md) elements.

**RESULTS**

buffer - filled with struct [AvailFontsHeader](_0102.md) followed by the
[T]AvailFonts elements, There will be duplicate entries
for fonts found both in memory and on disk, differing
only by type.  The existence of a disk font in the
buffer indicates that it exists as an entry in a font
contents file -- the underlying font file has not been
checked for validity, thus an [OpenDiskFont](OpenDiskFont.md) of it may
fail.
error - if non-zero, this indicates the number of bytes needed
for [AvailFonts](_0102.md) in addition to those supplied.  Thus
structure elements were not returned because of
insufficient bufBytes.

EXAMPLE
int afShortage, afSize;
struct [AvailFontsHeader](_0102.md) *afh;

...

afSize = 400;
do {
afh = (struct [AvailFontsHeader](_0102.md) *) AllocMem(afSize, 0);
if (afh) {
afShortage = AvailFonts(afh, afSize, AFF_MEMORY|AFF_DISK);
if (afShortage) {
FreeMem(afh, afSize);
afSize += afShortage;
}
}
else {
fail(&#034;AllocMem of [AvailFonts](_0102.md) buffer afh failedn&#034;);
break;
}
}
while (afShortage);

/*
* if (afh) non-zero here, then:
* 1. it points to a valid [AvailFontsHeader](_0102.md)
* 2. it must have FreeMem(afh, afSize) called for it after use
*/
