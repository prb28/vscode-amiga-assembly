# OFFSET

## Syntax
```assembly
offset [<expression>]
```

## Description
Switches to a special offset-section.
The contents of such a section is not included in the output. Their labels may be referenced as absolute offset symbols. Can be used to define structure offsets. The optional <expression> gives the start offset for this section. When missing the last offset of the previous offset- section is used, or 0. <expression> must evaluate as a constant!
