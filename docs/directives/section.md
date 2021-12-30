# SECTION

## Syntax
```assembly
section <name>[,<sec_type>][,<mem_type>]
```

## Description
Starts a new section named `<name>` or reactivates an old one.
`<sec_type>` defines the section type and may be code, text (same as code), data or bss. If the selected output format (like "aout", "tos" or "xfile") does not support section names then a missing `<sec_type>` argument interprets the first argument, <name>, as section type instead. Otherwise a missing `<sec_type>` defaults to a code section with the given name. The optional, and Amiga-specific, `<mem_ type>` defines a 32-bit memory attribute, which specifies where to load the section. `<mem_type>` is either a numerical constant or one of the keywords chip (for Chip-RAM) or fast (for Fast-RAM). Optionally it is also possible to attach the suffix _C, _F or _P to the `<sec_type>` argument for defining the mem- ory type. The memory attributes are currently only used in the hunk-format output module.
