  INCDIR     "include"
  INCLUDE    "custom.i"
  INCLUDE    "ndk/preferences.i"

FOO = 12
start:
  lea        CUSTOM,a6
  lea        FOO,a6
  bsr        MyWait
  MYMACRO
  dc.l       1
  rts
