
**NAME**

CloseWindow -- Close an Intuition window.

**SYNOPSIS**

```c
    CloseWindow( Window )
                 A0

    VOID CloseWindow( struct Window * );

```
Links: [Window](_00D4.md) [Window](_00D4.md) 

**FUNCTION**

Closes an Intuition window.  Unlinks it from the system, deallocates
its memory, and makes it disappear.

When this function is called, all IDCMP messages which have been sent
to your window are deallocated.  If the window had shared a message
Port with other windows, you must be sure that there are no unreplied
messages for this window in the message queue.  Otherwise, your program
will try to make use of a linked list (the queue) which contains free
memory (the old messages).  This will give you big problems.
See the code fragment CloseWindowSafely(), below.

NOTE:  If you have added a [Menu](_00D4.md) strip to this [Window](_00D4.md) (via
a call to [SetMenuStrip](SetMenuStrip.md)) you must be sure to remove that [Menu](_00D4.md) strip
(via a call to [ClearMenuStrip](ClearMenuStrip.md)) before closing your [Window](_00D4.md).

NOTE: This function may block until it is safe to de-link and free
your window.  Your program may thus be suspended while the user
plays with gadgets, menus, or window sizes and position.

New for V36: If your window is a &#034;Visitor Window&#034; (see OpenWindow)
CloseWindow will decrement the &#034;visitor count&#034; in the public screen
on which the window was open.  When the last visitor window is
closed, a signal will be sent to the public screen task, if this
was pre-arranged (see OpenScreen).

**INPUTS**

[Window](_00D4.md) = a pointer to a [Window](_00D4.md) structure

RESULT
None

BUGS

**SEE ALSO**

[OpenWindow](OpenWindow.md), [OpenScreen](OpenScreen.md), [CloseScreen](CloseScreen.md)

EXAMPLE
/*  CloseWindowSafely */

/* these functions close an Intuition window
* that shares a port with other Intuition
* windows or IPC customers.
*
* We are careful to set the UserPort to
* null before closing, and to free
* any messages that it might have been
* sent.
*/
#include &#034;exec/types.h&#034;
#include &#034;exec/nodes.h&#034;
#include &#034;exec/lists.h&#034;
#include &#034;exec/ports.h&#034;
#include &#034;intuition/intuition.h&#034;

CloseWindowSafely( win )
struct [Window](_00D4.md) *win;
{
/* we forbid here to keep out of race conditions with Intuition */
Forbid();

/* send back any messages for this window
* that have not yet been processed
*/
StripIntuiMessages( win-&#062;UserPort, win );

/* clear UserPort so Intuition will not free it */
win-&#062;UserPort = NULL;

/* tell Intuition to stop sending more messages */
ModifyIDCMP( win, 0L );

/* turn multitasking back on */
Permit();

/* and really close the window */
CloseWindow( win );
}

/* remove and reply all IntuiMessages on a port that
* have been sent to a particular window
* (note that we don't rely on the ln_Succ pointer
*  of a message after we have replied it)
*/
StripIntuiMessages( mp, win )
struct [MsgPort](_0099.md) *mp;
struct [Window](_00D4.md) *win;
{
struct [IntuiMessage](_00D4.md) *msg;
struct [Node](_0091.md) *succ;

msg = (struct [IntuiMessage](_00D4.md) *) mp-&#062;mp_MsgList.lh_Head;

while( succ =  msg-&#062;ExecMessage.mn_Node.ln_Succ ) {

if( msg-&#062;IDCMPWindow ==  win ) {

/* Intuition is about to free this message.
* Make sure that we have politely sent it back.
*/
Remove( msg );

ReplyMsg( msg );
}

msg = (struct [IntuiMessage](_00D4.md) *) succ;
}
}
