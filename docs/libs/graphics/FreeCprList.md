
**NAME**

FreeCprList -- deallocate hardware copper list

**SYNOPSIS**

```c
    FreeCprList(cprlist)
                  a0

    void FreeCprList(struct cprlist *);

```
Links: [cprlist](_00AD) 

**FUNCTION**

return [cprlist](_00AD) to free memory pool

**INPUTS**

[cprlist](_00AD) - pointer to [cprlist](_00AD) structure

**RESULTS**

memory returned and made available to other tasks

BUGS

**SEE ALSO**

[graphics/copper.h](_00AD)
