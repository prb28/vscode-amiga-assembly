**Bit Plane Control Register (new control bits)**

|Bit| Function| Description  |
|---|---|---  |
||15| x| don`t care- but drive to 0 for upward compatibility  |
||14| ZDBPSEL2| 3 bit field which selects which bitplane is to be used for ZD when ZDBBPEN is set- 000 selects BB1 and 111 selects BP8.  |
||13| ZDBPSEL1|   |
||12| ZDBPSEL0|   |
||11| ZDBPEN| Causes ZD pin to mirror bitplane selected by ZDBPSELx bits. This does not disable the ZD mode defined by ZDCTEN, but rather is "ored" with it.  |
||10| ZDCTEN| Causes ZD pin to mirror bit #15 of the active entry in high color table. When ZDCTEN is reset ZD reverts to mirroring color (0).  |
||09| KILLEHB| Disables extra halfbrite mode.  |
||08| RDRAM=0| Causes color table address to read the color table instead of writing to it.  |
||07| SOGEN=0| When set causes SOG output pin to go high  |
||06| PF2PRI| Gives playfield 2 priority over playfield 1.  |
||05| PF2P2| Playfield 2 priority code (with resp. to sprites).  |
||04| PF2P1|   |
||03| PF2P0|   |
||02| PF1P2| Playfield 1 priority code (with resp. to sprites).  |
||01| PF1P1|   |
||00| PF1P0||

