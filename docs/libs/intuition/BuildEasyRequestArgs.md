
**NAME**

BuildEasyRequestArgs -- Simple creation of system request. (V36)
BuildEasyRequest -- Varargs stub for BuildEasyRequestArgs(). (V36)

**SYNOPSIS**

```c
    ReqWindow = BuildEasyRequestArgs( RefWindow, easyStruct, IDCMP, Args )
    D0                                A0         A1          D0     A3

    struct Window *BuildEasyRequestArgs( struct Window *,
            struct EasyStruct *, ULONG, APTR );

    ReqWindow = BuildEasyRequest( RefWindow, easyStruct, IDCMP, Arg1, ... )

    struct Window *BuildEasyRequest( struct Window *,
            struct EasyStruct *, ULONG, APTR, ... );

```
Links: [Window](_00D4) [Window](_00D4) [EasyStruct](_00D4) [Window](_00D4) [Window](_00D4) [EasyStruct](_00D4) 

**FUNCTION**

This function is to EasyRequest() as [BuildSysRequest](BuildSysRequest) is to
AutoRequest(): it returns a pointer to the system requester
window.  The input from that window can then be processed
under application control.

It is recommended that this processing be done with
[SysReqHandler](SysReqHandler), so that future enhancement to the
processing will be enjoyed.

After you have determined that the requester is satisfied or
cancelled, you must free this requester using [FreeSysRequest](FreeSysRequest).

Please see the autodoc for EasyRequest().

NOTE: This function switches the processor stack to ensure
sufficient stack space for the function to complete.

**INPUTS**

[Window](_00D4) = reference window for requester: determines the
requester window title and screen.
easyStruct = pointer to [EasyStruct](_00D4) structure, as described
in the EasyRequest() autodocs.
IDCMP = (NOT A POINTER) provided application specific IDCMP
flags for the system requester window.
Args = see EasyRequest()

RESULT
A pointer to the system request window opened.  In the event
of problems, you may also be returned the value '0' which
is to be interpreted as the &#034;FALSE, Cancel&#034; choice, or
(if you have a second gadget defined) the value '1', which
is to be taken to mean the equivalent of your corresponding
left-most gadget.

If there is a problem creating the window, a recoverable alert may
be substituted for the requester, and the result, either 0 or 1,
returned.

BUGS
Does not put up alternative alert.
See also BUGS listed for [EasyRequestArgs](EasyRequestArgs).

**SEE ALSO**

[EasyRequestArgs](EasyRequestArgs), [FreeSysRequest](FreeSysRequest), [SysReqHandler](SysReqHandler),
[BuildSysRequest](BuildSysRequest), [AutoRequest](AutoRequest)
