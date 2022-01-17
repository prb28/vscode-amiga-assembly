
**NAME**

InitCode - initialize resident code modules (internal function)

**SYNOPSIS**

```c
    InitCode(startClass, version)
             D0          D1

    void InitCode(ULONG,ULONG);

```
**FUNCTION**

(This function may be ignored by application programmers)

Call [InitResident](InitResident.md) for all resident modules in the ResModules array
with the given startClass and with versions equal or greater than
that specified.  The segList parameter is passed as zero.

[Resident](_00A0.md) modules are used by the system to pull all its parts
together at startup.  Modules are initialized in a prioritized order.

Modules that do not have a startclass should be of priority -120.
RTF_AFTERDOS modues should start at -100 (working down).

**INPUTS**

startClass - the class of code to be initialized:
BITDEF RT,COLDSTART,0
BITDEF RT,SINGLETASK,1  ;ExecBase-&#062;ThisTask==0 (V36 only)
BITDEF RT,AFTERDOS,2    ;(V36 only)
version - a major version number

**SEE ALSO**

ResidentTag (RT) structure definition (resident.h)
