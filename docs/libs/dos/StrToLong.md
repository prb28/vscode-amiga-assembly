
**NAME**

StrToLong -- string to long value (decimal) (V36)

**SYNOPSIS**

```c
    characters = StrToLong(string,value)
    D0                       D1    D2

    LONG StrToLong(STRPTR, LONG *)

```
**FUNCTION**

Converts decimal string into LONG value.  Returns number of characters
converted.  Skips over leading spaces &#038; tabs (included in count).  If
no decimal digits are found (after skipping leading spaces &#038; tabs),
StrToLong returns -1 for characters converted, and puts 0 into value.

**INPUTS**

string - Input string.
value  - Pointer to long value.  Set to 0 if no digits are converted.

RESULT
result - Number of characters converted or -1.
