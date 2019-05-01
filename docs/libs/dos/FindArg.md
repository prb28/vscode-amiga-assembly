
**NAME**

FindArg - find a keyword in a template (V36)

**SYNOPSIS**

```c
    index = FindArg(template, keyword)
    D0                D1        D2

    LONG FindArg(STRPTR, STRPTR)

```
**FUNCTION**

Returns the argument number of the keyword, or -1 if it is not a
keyword for the template.  Abbreviations are handled.

**INPUTS**

keyword  - keyword to search for in template
template - template string to search

RESULT
index - number of entry in template, or -1 if not found

BUGS
In earlier published versions of the autodoc, keyword and template
were backwards.

**SEE ALSO**

[ReadArgs](ReadArgs), [ReadItem](ReadItem), [FreeArgs](FreeArgs)
