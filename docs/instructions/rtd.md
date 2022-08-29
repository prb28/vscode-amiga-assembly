# RTD - Return and Deallocate

## Operation
(SP) → PC; SP + 4 + dn → SP

## Syntax
```assembly
RTD #<displacement>
```

## Attributes
Unsized

## Description
Pulls the program counter value from the stack and adds the sign-extended 16-bit displacement value to the stack pointer. The previous program counter value is lost.

## Condition codes
Not affected.

*From MOTOROLA M68000 FAMILY Programmer's reference manual. Copyright 1992 by Motorola Inc./NXP. Adapted with permission.*