; SYNTAX TEST "source.asm.m68k" "general m68k grammar"

;* documentation comment
; <-- comment.block.documentation
            include "exec/types.i"
;           ^^^^^^^ keyword.control.import.m68k
;                   ^^^^^^^^^^^^^^ string.quoted.double.m68k
            incdir  include:
;           ^^^^^^ keyword.control.import.m68k
;                   ^^^^^^^^ string.other.path.m68k
            incbin  gfx/image.raw,10
;                   ^^^^^^^^^^^^^ string.other.path.m68k
;                                 ^^ constant.numeric.decimal.m68k
            section code,code_c
;           ^^^^^^^ keyword.control.section.m68k
;                   ^^^^ entity.name.section.m68k
;                        ^^^^^^ storage.type.section.m68k
            SECTION Data,DATA
;           ^^^^^^^ keyword.control.section.m68k
;                   ^^^^ entity.name.section.m68k
;                        ^^^^ storage.type.section.m68k
CUSTOM      equ     $dff000
; <------ variable.other.constant.m68k
;           ^^^ keyword.operator.assignment.m68k
;                   ^^^^^^^ constant.numeric.hex.m68k
CONST=5
; <----- variable.other.constant.m68k
;    ^ keyword.operator.assignment.m68k
;     ^ constant.numeric.decimal.m68k

start:
; <----- entity.name.label.m68k
;    ^ punctuation.separator.label.m68k
            lea     CUSTOM,a6               ; comment
;           ^^^ keyword.other.opcode.cpu.l.m68k
;                   ^^^^^^ variable.other.m68k
;                          ^^ variable.language.m68k
;                                           ^^^^^^^^^ comment.line.semicolon
.loop       move.l  (a0)+,-(sp)
; <----- entity.name.label.m68k
;           ^^^^^^ keyword.other.opcode.cpu.bwl.m68k
;           ^^^^ - support.type.size.m68k
;               ^^ support.type.size.m68k
;                    ^^ variable.language.m68k
;                         ^ keyword.operator.arithmetic.m68k
;                           ^^ variable.language.m68k
            MOVEQ   #%0101,d0
;           ^^^^^ keyword.other.opcode.cpu.l.m68k
;                    ^^^^^ constant.numeric.binary.m68k
            moveq   #@17,d1
;                    ^^^ constant.numeric.octal.m68k
            dbf     d7,.loop
;           ^^^ keyword.other.opcode.cpu.w.m68k
;                      ^^^^^ variable.other.m68k
1$:         bra.s   1$
; <-- entity.name.label.m68k
;           ^^^^^ keyword.other.opcode.cpu.bwls.m68k
;              ^^ support.type.size.m68k
;                   ^^ entity.name.label.local.m68k
    local:  nop
;   ^^^^^ entity.name.label.m68k
;           ^^^ keyword.other.opcode.cpu.m68k
            move.l  #'ABCD',d0
;                    ^^^^^^ string.quoted.single.m68k
            fmove.x fp0,fp1
;           ^^^^^^^ keyword.other.opcode.fpu.bwlsdxp.m68k
;                   ^^^ variable.language.m68k
            move.q  d0,d1
;           ^^^^ keyword.other.opcode.cpu.bwl.m68k
;               ^^ - entity.name.function.macro.m68k
            dr.w    label
;           ^^^^ keyword.control.directive.data.pc.m68k
            cnop    0,4
;           ^^^^ keyword.control.other.m68k
            end
;           ^^^ keyword.control.other.m68k

SomeMacro   macro
            move.l  \1,\2
;                   ^^ variable.parameter.macro.m68k
.l\@        bra.s   .l\@
; <---- entity.name.label.m68k
;                   ^^^^ variable.other.m68k
            endm
