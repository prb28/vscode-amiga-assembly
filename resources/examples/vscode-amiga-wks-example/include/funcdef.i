   INCDIR     "include_std"
   INCLUDE    "exec/libraries.i"

   MACRO      FUNCDEF
_LVO\1      EQU      FUNC_CNT
FUNC_CNT    SET      FUNC_CNT-LIB_VECTSIZE
   ENDM

FUNC_CNT    SET      LIB_USERDEF