; SYNTAX TEST "source.asm.m68k" "colorization issues"

; Issue #343 - directives colored as directives
MyMacro     macro
; <------- entity.name.function.macro.m68k
;           ^^^^^ keyword.control.macro.m68k
            endm
;           ^^^^ keyword.control.macro.m68k
            macro   OtherMacro
;           ^^^^^ keyword.control.macro.m68k
;                   ^^^^^^^^^^ entity.name.function.macro.m68k
            endm
Buffer:     ds.b    100
;           ^^^^ keyword.control.directive.data.m68k - keyword.other.opcode
;             ^^ support.type.size.m68k
            dc.w    1,2,3
;           ^^^^ keyword.control.directive.data.m68k
Offset      rs.w    1
; <------ variable.other.constant.m68k
;           ^^^^ keyword.control.directive.storage.m68k
;             ^^ support.type.size.m68k

; Issue #346 - immediate '#' and operators
            addq.w  #RightBound,d6
;           ^^^^^^ keyword.other.opcode.cpu.bwl.m68k
;                   ^ keyword.operator.immediate.m68k
;                    ^^^^^^^^^^ variable.other.m68k
;                              ^ punctuation.separator.comma.m68k
;                               ^^ variable.language.m68k
            move.l  #(4+2)*3,d0
;                    ^ punctuation.section.parens.m68k
;                      ^ keyword.operator.arithmetic.m68k
;                         ^ keyword.operator.arithmetic.m68k
;                          ^ constant.numeric.decimal.m68k

; Issue #347 - labels named like instructions
Move:       bsr     Move
; <---- entity.name.label.m68k
;           ^^^ keyword.other.opcode.cpu.bwls.m68k
;                   ^^^^ variable.other.m68k - keyword.other.opcode
            bsr     Stop
;                   ^^^^ variable.other.m68k - keyword.other.opcode

; Issue #348 - more registers
            move.w  sr,d0
;                   ^^ variable.language.m68k
            move.w  d0,ccr
;                      ^^^ variable.language.m68k
            move.l  a0,usp
;                      ^^^ variable.language.m68k
            move.l  #__RS,d0
;                    ^^^^ variable.language.builtin.m68k

; Issue #349 - digits inside identifiers
            move.w  #$0f00,color00(a6)
;                    ^^^^^ constant.numeric.hex.m68k
;                          ^^^^^^^ variable.other.m68k - constant.numeric
            move.w  d0,$dff180.w
;                      ^^^^^^^ constant.numeric.hex.m68k
;                             ^^ support.type.size.m68k

; Issue #350 - macro calls
            MyMacro d0,d1
;           ^^^^^^^ entity.name.function.macro.m68k
            WAITBLIT
;           ^^^^^^^^ entity.name.function.macro.m68k

; Issue #352 - '*' is the program counter in operands
SinTableLength = *-SinTable
; <-------------- variable.other.constant.m68k
;              ^ keyword.operator.assignment.m68k
;                ^ variable.language.pc.m68k - comment
;                 ^ keyword.operator.arithmetic.m68k
;                  ^^^^^^^^ variable.other.m68k - comment
* full line comment
; <- comment.block.asterisk
    * indented full line comment
;   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^ comment.block.asterisk
            rts     * trailing comment
;                   ^^^^^^^^^^^^^^^^^^ comment.line.asterisk.m68k
            move.l  (a0,d0.w*4),d1
;                           ^ keyword.operator.arithmetic.m68k - variable.language.pc.m68k

; Issue #355 - 'if' directive
            if      FOO>1
;           ^^ keyword.control.condition.m68k
            elseif
;           ^^^^^^ keyword.control.condition.m68k
            else
;           ^^^^ keyword.control.condition.m68k
            endc
;           ^^^^ keyword.control.condition.m68k
            ifne    FOO
;           ^^^^ keyword.control.condition.m68k
            endif
;           ^^^^^ keyword.control.condition.m68k

; Issue #363 - rseven
            rseven
;           ^^^^^^ keyword.control.other.m68k
            rsreset
;           ^^^^^^^ keyword.control.other.m68k

; Issue #354 - constants defined with colons
TESTMODE::  = 2
; <-------- variable.other.constant.m68k
;       ^^ punctuation.separator.label.m68k
;           ^ keyword.operator.assignment.m68k
;             ^ constant.numeric.decimal.m68k
WITHCOLON:  equ     $dff000
; <--------- variable.other.constant.m68k
;        ^ punctuation.separator.label.m68k
;           ^^^ keyword.operator.assignment.m68k
;                   ^^^^^^^ constant.numeric.hex.m68k
