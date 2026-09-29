        INCDIR  "include"
        INCLUDE "custom.i"

start:
        lea     CUSTOM,a6
        bsr     MyWait
        MYMACRO
        dc.l    1
        rts
