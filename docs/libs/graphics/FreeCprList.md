
**NAME**

FreeCprList -- deallocate hardware copper list

**SYNOPSIS**

```c
    FreeCprList(cprlist)
                  a0

    void FreeCprList(struct cprlist *);

```
Links: [cprlist](_OOAD) 

**FUNCTION**

return [cprlist](_OOAD) to free memory pool

**INPUTS**

[cprlist](_OOAD) - pointer to [cprlist](_OOAD) structure

**RESULTS**

memory returned and made available to other tasks

BUGS

**SEE ALSO**

[graphics/copper.h](_OOAD)
