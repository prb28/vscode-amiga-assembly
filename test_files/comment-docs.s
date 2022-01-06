LabelNone:
    move.w d0,d1
    rts

LabelSameLine: ; Same line example
    move.w d0,d1
    rts

; Before example
;
; Lorem ispum dolor
; Sit amet
LabelBefore:
    move.w d0,d1
    rts

; After example
;
; Lorem ispum dolor
; Sit amet
LabelAfter:
    move.w d0,d1
    rts

; Before/after example
LabelBoth:
; Lorem ispum dolor
; Sit amet
    move.w d0,d1
    rts

********************************************************************************
* Star example
*
* Lorem ispum dolor
* Sit amet
********************************************************************************
LabelStar:
    move.w d0,d1
    rts

; Macro example
;
; Lorem ispum dolor
; Sit amet
MacroExample MACRO
    move.w d0,d1
    endm

VAR_EXAMPLE = 42 ; Variable example