
**NAME**

ReadArgs - Parse the command line input (V36)

**SYNOPSIS**

```c
    result = ReadArgs(template, array, rdargs)
    D0                   D1      D2      D3

    struct RDArgs * ReadArgs(STRPTR, LONG *, struct RDArgs *)

```
Links: [RDArgs](_0076) [RDArgs](_0076) 

**FUNCTION**

Parses and argument string according to a template.  Normally gets
the arguments by reading buffered IO from [Input](Input), but also can be
made to parse a string.  MUST be matched by a call to [FreeArgs](FreeArgs).

ReadArgs() parses the commandline according to a template that is
passed to it.  This specifies the different command-line options and
their types.  A template consists of a list of options.  Options are
named in &#034;full&#034; names where possible (for example, &#034;Quick&#034; instead of
&#034;Q&#034;).  Abbreviations can also be specified by using &#034;abbrev=option&#034;
(for example, &#034;Q=Quick&#034;).

Options in the template are separated by commas.  To get the results
of ReadArgs(), you examine the array of longwords you passed to it
(one entry per option in the template).  This array should be cleared
(or initialized to your default values) before passing to ReadArgs().
Exactly what is put in a given entry by ReadArgs() depends on the type
of option.  The default is a string (a sequence of non-whitespace
characters, or delimited by quotes, which will be stripped by
ReadArgs()), in which case the entry will be a pointer.

Options can be followed by modifiers, which specify things such as
the type of the option.  Modifiers are specified by following the
option with a '/' and a single character modifier.  Multiple modifiers
can be specified by using multiple '/'s.  Valid modifiers are:

/S - Switch.  This is considered a boolean variable, and will be
set if the option name appears in the command-line.  The entry
is the boolean (0 for not set, non-zero for set).

/K - Keyword.  This means that the option will not be filled unless
the keyword appears.  For example if the template is &#034;Name/K&#034;,
then unless &#034;Name=&#060;string&#062;&#034; or &#034;Name &#060;string&#062;&#034; appears in the
command line, Name will not be filled.

/N - Number.  This parameter is considered a decimal number, and will
be converted by ReadArgs.  If an invalid number is specified,
an error will be returned.  The entry will be a pointer to the
longword number (this is how you know if a number was specified).

/T - Toggle.  This is similar to a switch, but when specified causes
the boolean value to &#034;toggle&#034;.  Similar to /S.

/A - Required.  This keyword must be given a value during command-line
processing, or an error is returned.

/F - Rest of line.  If this is specified, the entire rest of the line
is taken as the parameter for the option, even if other option
keywords appear in it.

/M - Multiple strings.  This means the argument will take any number
of strings, returning them as an array of strings.  Any arguments
not considered to be part of another option will be added to this
option.  Only one /M should be specified in a template.  Example:
for a template &#034;Dir/M,All/S&#034; the command-line &#034;foo bar all qwe&#034;
will set the boolean &#034;all&#034;, and return an array consisting of
&#034;foo&#034;, &#034;bar&#034;, and &#034;qwe&#034;.  The entry in the array will be a pointer
to an array of string pointers, the last of which will be NULL.

There is an interaction between /M parameters and /A parameters.
If there are unfilled /A parameters after parsing, it will grab
strings from the end of a previous /M parameter list to fill the
/A's.  This is used for things like Copy (&#034;From/A/M,To/A&#034;).

ReadArgs() returns a struct [RDArgs](_0076) if it succeeds.  This serves as an
&#034;anchor&#034; to allow [FreeArgs](FreeArgs) to free the associated memory.  You can
also pass in a struct [RDArgs](_0076) to control the operation of ReadArgs()
(normally you pass NULL for the parameter, and ReadArgs() allocates
one for you).  This allows providing different sources for the
arguments, providing your own string buffer space for temporary
storage, and extended help text.  See [&#060;dos/rdargs.h&#062;](_0076) for more
information on this.  Note: if you pass in a struct [RDArgs](_0076), you must
still call [FreeArgs](FreeArgs) to release storage that gets attached to it,
but you are responsible for freeing the [RDArgs](_0076) yourself.

See BUGS regarding passing in strings.

**INPUTS**

template - formatting string
array    - array of longwords for results, 1 per template entry
rdargs   - optional rdargs structure for options.  [AllocDosObject](AllocDosObject)
should be used for allocating them if you pass one in.

RESULT
result   - a struct [RDArgs](_0076) or NULL for failure.

BUGS
In V36, there were a couple of minor bugs with certain argument
combinations (/M/N returned strings, /T didn't work, and /K and
/F interacted).  Also, a template with a /K before any non-switch
parameter will require the argument name to be given in order for
line to be accepted (i.e. &#034;parm/K,xyzzy/A&#034; would require
&#034;xyzzy=xxxxx&#034; in order to work - &#034;xxxxx&#034; would not work).  If you
need to avoid this for V36, put /K parameters after all non-switch
parameters.  These problems should be fixed for V37.

Currently (V37 and before) it requires any strings passed in to have
newlines at the end of the string.  This may or may not be fixed in
the future.

**SEE ALSO**

[FindArg](FindArg), [ReadItem](ReadItem), [FreeArgs](FreeArgs), [AllocDosObject](AllocDosObject)
