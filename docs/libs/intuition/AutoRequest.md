
**NAME**

AutoRequest -- Automatically build and get response from a requester.

**SYNOPSIS**

```c
    Response = AutoRequest( Window, BodyText, PosText, NegText,
    D0                      A0      A1        A2       A3
                    PosFlags, NegFlags, Width, Height )
                    D0        D1        D2     D3

    BOOL AutoRequest( struct Window *, struct IntuiText *,
            struct IntuiText *, struct IntuiText *,
            ULONG, ULONG, WORD, WORD );

```
Links: [Window](_00D4) [Window](_00D4) [IntuiText](_00D4) [IntuiText](_00D4) [IntuiText](_00D4) 

**FUNCTION**

This procedure automatically builds a requester for you and then
waits for a response from the user, or for the system to satisfy your
request.  If the response is positive, this procedure returns TRUE.
If the response is negative, this procedure returns FALSE.

An IDCMPFlag specification is created by bitwise &#034;or'ing&#034; your
PosFlags, NegFlags, and the IDCMP classes IDCMP_GADGETUP and
IDCMP_RAWKEY.  You may specify zero flags for either the PosFlags
or NegFlags arguments.

The [IntuiText](_00D4) arguments, and the width and height values, are
passed directly to the [BuildSysRequest](BuildSysRequest) procedure along with
your window pointer and the IDCMP flags.  Please refer to
[BuildSysRequest](BuildSysRequest) for a description of the [IntuiText](_00D4) that you are
expected to supply when calling this routine.  It's an important
but long-winded description that need not be duplicated here.

If the [BuildSysRequest](BuildSysRequest) procedure does not return a pointer
to a window, it will return TRUE or FALSE (not valid structure
pointers) instead, and these BOOL values will be returned to
you immediately.

On the other hand, if a valid window pointer is returned, that
window will have had its IDCMP ports and flags initialized according
to your specifications.  AutoRequest() then waits for IDCMP messages
on the UserPort, which satisfies one of four requirements:
-   either the message is of a class that matches
one of your PosFlags arguments (if you've supplied
any), in which case this routine returns TRUE.  Or
-   the message class matches one of your NegFlags
arguments (if you've supplied any), in which case
this routine returns FALSE.  Or
-   the IDCMP message is of class IDCMP_GADGETUP, which means that
one of the two gadgets, as provided with the PosText and NegText
arguments, was selected by the user.  If the TRUE gadget
was selected, TRUE is returned.  If the FALSE gadget was
selected, FALSE is returned.
-   Lastly, two IDCMP_RAWKEY messages may satisfy the request: those
for the V and B keys with the left Amiga key depressed.
These keys, satisfy the gadgets on the left or right side of
the requester--TRUE or FALSE--, respectively.

NOTE: For V36, these two keys left-Amiga-B and V are processed
through the default keymap.

When the dust has settled, this routine calls [FreeSysRequest](FreeSysRequest) if
necessary to clean up the requester and any other allocated memory.

NOTE: For V36, this function now switches the processor stack
to ensure sufficient stack space for the function to succeed.

**INPUTS**

[Window](_00D4) = pointer to a [Window](_00D4) structure.  See [BuildSysRequest](BuildSysRequest)
for a full discussion.
BodyText = pointer to an [IntuiText](_00D4) structure
PosText = pointer to an [IntuiText](_00D4) structure, may by NULL.
NegText = pointer to an [IntuiText](_00D4) structure, MUST be valid!
PosFlags = flags for the IDCMP
NegFlags = flags for the IDCMP
Width, Height = the sizes to be used for the rendering of the requester

NOTE for V36: The width and height parameters are ignored, as
are several other specifications in the [IntuiText](_00D4), to make
AutoRequest() requesters retroactively conform to the new look
designed for EasyRequest().

RESULT
The return value is either TRUE or FALSE.  See the text above for a
complete description of the chain of events that might lead to either
of these values being returned.

NOTES
When DOS brings up AutoRequests() on your process (eg.
&#034;Please insert volume XXX in any drive&#034;, they normally come
up on the Workbench screen.  If you set your [Process](_0078) pr_WindowPtr
field to point to one of your windows, then DOS will bring its
requesters up on the same screen as that window.  A pr_WindowPtr
of -1 prevents requesters from coming up at all.
(Some FileSystem requesters cannot be redirected or supressed).

BUGS
The requester no longer devolves into a call to [DisplayAlert](DisplayAlert)
if there is not enough memory for the requester.

**SEE ALSO**

EasyRequest(), [BuildSysRequest](BuildSysRequest), [SysReqHandler](SysReqHandler)
