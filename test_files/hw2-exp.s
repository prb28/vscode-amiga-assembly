;---------------------------------------------
; 68K for Amiga OS
;----------------------------------------------
                include "exec/types.i"
                include "exec/funcdef.i"
                include "exec/exec.i"
                include "libraries/dos_lib.i"
                include "libraries/dos.i"

                section code,code
start
                lea     dosname,a1
                moveq   #0,d0
                move.l  4,a6
                jsr     _LVOOpenLibrary(a6)
                move.l  d0,a6
                tst.l   d0
                beq     error
                jsr     _LVOOutput(a6)
                move.l  d0,d1
                move.l  #Message,d2
                moveq   #MessageEnd-Message,d3
                jsr     _LVOWrite(a6)
                move.l  a6,a1
                move.l  4,a6
                jsr     _LVOCloseLibrary(a6)
                moveq   #0,d0
                rts
error           moveq   #-1,d0
                rts

                section  data,data
dosname         dc.b    'dos.library',0
Message         dc.b    'Hello world!',10,0
MessageEnd