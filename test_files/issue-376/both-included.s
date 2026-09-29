  INCDIR     "include"
  INCLUDE    "custom.i"
  INCLUDE    "ndk/preferences.i"

start:
  lea        CUSTOM,a6
  bsr        MyWait
  MYMACRO
  dc.l       1
  rts
