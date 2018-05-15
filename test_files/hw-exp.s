;---------------------------------------------
; 68K for Amiga (AmigaDOS 1.3)
;----------------------------------------------
         include    "exec/types.i"
         include    "exec/funcdef.i" 
         include    "exec/exec.i"
         include    "libraries/dos_lib.i"
         include    "libraries/dos.i"

         section    _code,code
start    move.l     #dos.library,a1          ;open the dos library
         moveq      #0,d0
         move.l     4,a6
         jsr        _LVOOpenLibrary(a6)
         move.l     d0,a6
         tst.l      d0                       ;if result is NULL,
         beq.w      exit                     ;then exit
         jsr        _LVOOutput(a6)           ;get stdout
         move.l     d0,d1                    ;call Write(stdout,buff,size)
         move.l     #message,d2
         moveq      #12,d3
         jsr        _LVOWrite(a6)
         move.l     a6,a1                    ;close library
         move.l     4,a6
         jsr        _LVOCloseLibrary(a6)
exit     rts                                 ;exit

         section    _data,data
message  dc.b       'Hello world!',10
;         end     start