**Blitter control 0, lower 8 bits (minterms)**

The BLTCON0L register writes the low bits of BLTCON0, thereby expediting the set up of some blits and generally speeding up the software, since the upper bits are often the same (ECS only).

|Bit| BLTCON0L|
|---:|---|
|07| LF7|
|06| LF6|
|05| LF5|
|04| LF4|
|03| LF3|
|02| LF2|
|01| LF1|
|00| LF0|

|Function| Description|
|---|---|
|LF7-0| Logic function minterm select lines (same as bits 07-00 of [BLTCON0](DFF040_BLTCON0.md))|
