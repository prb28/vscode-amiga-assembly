
**NAME**

Cli -- Returns a pointer to the CLI structure of the process (V36)

**SYNOPSIS**

```c
    cli_ptr = Cli()
    D0

    struct CommandLineInterface *Cli(void)

```
Links: [CommandLineInterface](_0078.md) 

**FUNCTION**

Returns a pointer to the CLI structure of the current process, or NULL
if the process has no CLI structure.

RESULT
cli_ptr - pointer to the CLI structure, or NULL.

**SEE ALSO**

