Register |Address|Read/Write |  Agnus/Denise/Paula     |    Function
-------- |-------| -----     |  -------   |    --------
SPRxCTL   | 142   |   W   |  A D( [E](_00A5.md) ) |Sprite x vert stop position and control data
SPRxPOS   | 140    |  W    |  A D    | Sprite x vert-horiz start position data

These two registers work together as position, size and
feature sprite-control registers.  They are usually loaded
by the sprite DMA channel during horizontal blank;
however, they may be loaded by either processor at any
time.

SPRxPOS register:

BIT#  | SYM    |  FUNCTION
----  | ----   |  -----------------------------
15-08 | SV7-SV0 | Start vertical value. High bit(SV8) is in SPRxCTL register below.
07-00 | SH8-SH1 | Start horizontal value. Low bit(SH0) is in SPRxCTL register below.

SPRxCTL register (writing this address disables sprite horizontal comparator circuit):

BIT#  |  SYM      | FUNCTION
----  |  -------- | -----------------------------
15-08  | EV7-EV0  | End (stop) vertical value low 8 bits
07     | ATT      | Sprite attach control bit (odd sprites)
06-04  |  X       | Not used
02     | SV8      | Start vertical value high bit
01     | EV8      | End (stop) vertical value high bit
00     | SH0      | Start horizontal value low bit
