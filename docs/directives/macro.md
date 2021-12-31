# MACRO

## Syntax
```assembly
macro <name>
```

## Description
Defines a macro which can be referenced by `<name>`.
The <name> may also appear at the left side of the macro directive, starting at the first column. Then the operand field is ignored. The macro definition is closed by an endm directive. When calling a macro you may pass up to 9 arguments, separated by comma. Those arguments are referenced within the macro context as `\1` to `\9`. Parameter `\0` is set to the macro’s first qualifier (mnemonic extension), when given. In Devpac- and PhxAss-compatibility mode, or with option `-allmp`, up to 35 arguments are accepted, where argument 10-35 can be referenced by `\a` to `\z`.

### Special macro parameters:

|Parameter|Description|
|---------|-----------|
|`\@`|Insert a unique id, useful for defining labels. Every macro call gets its own unique id.|
|`\@!`|Push the current unique id onto a global id stack, then insert it.|
|`\@?`|Push the current unique id below the top element of the global id stack, then insert it.|
|`\@@`|Pull the top element from the global id stack and insert it. The macro’s current unique id is not affected by this operation.|
|`\#`|Insert the number of arguments that have been passed to this macro. Equivalent to the contents of `NARG`.|
|`\?n`|Insert the length of the nth macro argument.|
|`\.`|Insert the argument which is selected by the current value of the CARG symbol (first argument, when `CARG` is 1).|
|`\+`|Works like `\.`, but increments the value of `CARG` after that.|
|`\-`|Works like `\.`, but decrements the value of `CARG` after that.|
|`\<symbolname>`|Inserts the current decimal value of the absolute symbol symbolname.|
|`\$<symbolname>`|Inserts the current hexadecimal value of the absolute symbol symbolname, without leading `$`.|
