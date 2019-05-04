
**NAME**

DisplayAlert -- Create the display of an alert message.

**SYNOPSIS**

```c
    Response = DisplayAlert( AlertNumber, String, Height )
    D0                       D0           A0      D1

    BOOL DisplayAlert( ULONG, UBYTE *, WORD );

```
**FUNCTION**

Creates an alert display with the specified message.

If the system can recover from this alert, it's a RECOVERY_ALERT and
this routine waits until the user presses one of the mouse buttons,
after which the display is restored to its original state and a
BOOL value is returned by this routine to specify whether or not
the user pressed the LEFT mouse button.

If the system cannot recover from this alert, it's a DEADEND_ALERT
and this routine returns immediately upon creating the alert display.
The return value is FALSE.

NOTE: Starting with V33, if Intuition can't get enough
memory for a RECOVERY_ALERT, the value FALSE will be returned.

AlertNumber is a LONG value, historically related to the value
sent to the [Alert](../exec/Alert) routine.  But the only bits that are pertinent to
this routine are the ALERT_TYPE bit(s).  These bits must be set to
either RECOVERY_ALERT for alerts from which the system may safely
recover, or DEADEND_ALERT for those fatal alerts.  These states are
described in the paragraph above.   There is a third type of
alert, the DAISY_ALERT, which is used only by the Exec.

The string argument points to an AlertMessage string.  The AlertMessage
string is comprised of one or more substrings, each of which is
composed of the following components:
- first, a 16-bit x-coordinate and an 8-bit y-coordinate,
describing where on the alert display you want this string
to appear.  The y-coordinate describes the offset to the
baseline of the text.
- then, the bytes of the string itself, which must be
null-terminated (end with a byte of zero)
- lastly, the continuation byte, which specifies whether or
not there's another substring following this one.  If the
continuation byte is non-zero, there IS another substring
to be processed in this alert message.  If the continuation
byte is zero, this is the last substring in the message.

The last argument, Height, describes how many video lines tall you
want the alert display to be.

New for V36: Alerts are always rendered in Topaz 8 (80 column font),
regardless of the system default font.  Also, RECOVERY_ALERTs are
displayed in amber, while DEADEND_ALERTs are still red.  Alerts
no longer push down the application screens to be displayed.  Rather,
they appear alone in a black display.

Also new for V36: Alerts block each other out, and input
during an alert is deprived of the rest of the system.  Internal
input buffers still cause alert clicks to be processed by
applications sometimes.

**INPUTS**

AlertNumber = the number of this alert message.  The only pertinent
bits of this number are the ALERT_TYPE bit(s).  The rest of the
number is ignored by this routine.
String = pointer to the alert message string, as described above
Height = minimum display lines required for your message

RESULT
A BOOL value of TRUE or FALSE.  If this is a DEADEND_ALERT, FALSE
is always the return value.  If this is a RECOVERY_ALERT. The return
value will be TRUE if the user presses the left mouse button in
response to your message, and FALSE if the user presses the right hand
button is response to your text, or if the alert could not
be posted.

BUGS
If the system is worse off than you think, the level of your alert
may become DEADEND_ALERT without you ever knowing about it.  This
will NOT happen due simply to low memory.  Rather, the alert
display will be skipped, and FALSE will be returned.

The left and right button clicks satisfying the alerts are
unfortunately passed to the normal applications, because of
some internal system input buffering.

**SEE ALSO**

