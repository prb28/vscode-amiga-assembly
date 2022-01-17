
**NAME**

CliInitRun -- Set up a process to be a shell from initial packet

**SYNOPSIS**

```c
    flags = CliInitRun( packet )
    D0                    A0

    LONG CliInitRun( struct DosPacket * )

```
Links: [DosPacket](_0078.md) 

**FUNCTION**

This function initializes a process and CLI structure for a new
shell, from parameters in an initial packet passed by the system
(Run, System(), Execute()).  The format of the data in the packet
is purposely not defined.  The setup includes all the normal fields
in the structures that are required for proper operation (current
directory, paths, input streams, etc).

It returns a set of flags containing information about what type
of shell invocation this is.

Definitions for the values of fn:
Bit 31     Set to indicate flags are valid
Bit  3     Set to indicate asynch system call
Bit  2     Set if this is a System() call
Bit  1     Set if user provided input stream
Bit  0     Set if RUN provided output stream

If Bit 31 is 0, then you must check [IoErr](IoErr.md) to determine if an error
occurred.  If [IoErr](IoErr.md) returns a pointer to your process, there has
been an error, and you should clean up and exit.  The packet will
have already been returned by [CliInitNewcli](CliInitNewcli.md).  If it isn't a pointer
to your process and Bit 31 is 0, you should wait before replying
the packet until after you've loaded the first command (or when you
exit).  This helps avoid disk &#034;gronking&#034; with the Run command.
(Note: this is different from what you do for CliInitNewcli().)

If Bit 31 is 1, then if Bit 3 is one, [ReplyPkt](ReplyPkt.md) the packet
immediately (Asynch System()), otherwise wait until your shell exits
(Sync System(), [Execute](Execute.md)).
(Note: this is different from what you do for CliInitNewcli().)

This function is very similar to [CliInitNewcli](CliInitNewcli.md).

**INPUTS**

packet - the initial packet sent to your process [MsgPort](_0099.md)

RESULT
fn - flags or a pointer

**SEE ALSO**

[CliInitNewcli](CliInitNewcli.md), [ReplyPkt](ReplyPkt.md), [WaitPkt](WaitPkt.md), System(), [Execute](Execute.md), [IoErr](IoErr.md)
