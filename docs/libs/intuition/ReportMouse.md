**NAME**

ReportMouse -- Tell Intuition whether to report mouse movement.

**SYNOPSIS**

```c
    ReportMouse( Boolean, Window )
                 D0       A0        <-note

    VOID ReportMouse( BOOL, struct Window * );

SPECIAL NOTE
    Some compilers and link files switch the arguments to this function
    about in unpredictable ways.  We apologize for this confusion
    wrapped around an error enclosing a mistake.
    The call will take one of two forms:

            ReportMouse(Boolean, Window);
                    -or-
            ReportMouse(Window, (ULONG)Boolean);

    The first form is the one that corresponds to the amiga.lib supplied
    by Commodore.  The linker libraries and "pragmas" of some compilers
    supply the alternate form.

    A key point to remember is that the form of the function in ROM
    has always been the same, so there has always been object code
    compatibility.  However some care should be taken when switching
    compilers or switching between stubs and pragmas.

    From assembler the interface has always been:
            Boolean in D0, Window in A0

    Also, it is still endorsed to simply set the WFLG_REPORTMOUSE flag bit
    in Window->Flags, or reset it, on your own.  Make the operation
    an atomic assembly instruction (OR.W #WFLG_REPORTMOUSE,wd_Flags+2(A0)
    where A0 contains your window pointer).  Most compilers will produce
    an atomic operation when faced with:
                    Window->Flags |= WFLG_REPORTMOUSE;
                    Window->Flags &=~WFLG_REPORTMOUSE;
    or else bracket the operation between Forbid()/Permit().

```
Links: [Window](_00D4) [Window](_00D4) [Window](_00D4) [Forbid()/Permit()](../exec/Permit) 

**FUNCTION**

Tells Intuition whether or not to broadcast mouse-movement events to
your window when it's the active one.  The Boolean value specifies
whether to start or stop broadcasting position information of
mouse-movement.  If the window is the active one, mouse-movement
reports start coming immediately afterwards.  This same routine will
change the current state of the GACT_FOLLOWMOUSE function of a
currently-selected gadget too.

Note that calling ReportMouse() when a gadget is selected will only
temporarily change whether or not mouse movements are reported while
that gadget remains selected; the next time the gadget is selected, its
GACT_FOLLOWMOUSE flag is examined anew.

Note also that calling ReportMouse() when no gadget is currently
selected will change the state of the window's WFLG_REPORTMOUSE flag,
but will have no effect on any gadget that may be subsequently
selected. (This is all fixed in V36.)

The ReportMouse() function is first performed when [OpenWindow](OpenWindow)
is first called; if the flag WFLG_REPORTMOUSE is included among
the options, then all mouse-movement events are reported
to the opening task and will continue to be reported
until ReportMouse() is called with a Boolean value of FALSE.
If WFLG_REPORTMOUSE is not set, then no mouse-movement reports will
be broadcast until ReportMouse() is called with a Boolean of TRUE.

Note that the WFLG_REPORTMOUSE flag, as managed by this routine,
determines IF mouse messages are to be broadcast.  Determining HOW
they are to be broadcast is determined by the IDCMP_MOUSEMOVE
IDCMPFlag.

**INPUTS**

[Window](_00D4) = pointer to a [Window](_00D4) structure associated with this request
Boolean = TRUE or FALSE value specifying whether to turn this
function on or off

RESULT
None

BUGS
See above

**SEE ALSO**

The Input and Output section of the Intuition Reference Manual
