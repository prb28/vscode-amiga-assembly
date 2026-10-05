**Blitter control register 0**

These two control registers are used together to control blitter operations. There are 2 basic modes, area and line, which are selected by bit 0 of BLTCON1, as shown below.

**Area mode ("normal")**

|Bit| BLTCON0| BLTCON1|
|---:|---|---|
|15| ASH3| BSH3|
|14| ASH2| BSH2|
|13| ASH1| BSH1|
|12| ASH0| BSH0|
|11| USEA| X|
|10| USEB| X|
|09| USEC| X|
|08| USED| X|
|07| LF7| DOFF|
|06| LF6| X|
|05| LF5| X|
|04| LF4| EFE|
|03| LF3| IFE|
|02| LF2| FCI|
|01| LF1| DESC|
|00| LF0| LINE(=0)|

|Function| Description|
|---|---|
|ASH3-0| Shift value of A source|
|BSH3-0| Shift value of B source|
|USEA| Mode control bit to use source A|
|USEB| Mode control bit to use source B|
|USEC| Mode control bit to use source C|
|USED| Mode control bit to use destination D|
|LF7-0| Logic function minterm select lines|
|DOFF| Disables the D output - for external ALUs. The cycle occurs normally, but the data bus is tristate (ECS only)|
|EFE| Exclusive fill enable|
|IFE| Inclusive fill enable|
|FCI| Fill carry input|
|DESC| Descending (decreasing address) control bit|
|LINE| Line mode control bit (set to 0)|
|X| Unused|

**Line mode (line draw)**

|Bit| BLTCON0| BLTCON1|
|---:|---|---|
|15| START3| TEXTURE3|
|14| START2| TEXTURE2|
|13| START1| TEXTURE1|
|12| START0| TEXTURE0|
|11| 1| 0|
|10| 0| 0|
|09| 1| 0|
|08| 1| 0|
|07| LF7| 0|
|06| LF6| SIGN|
|05| LF5| 0 (Reserved)|
|04| LF4| SUD|
|03| LF3| SUL|
|02| LF2| AUL|
|01| LF1| SING|
|00| LF0| LINE(=1)|

|Function| Description|
|---|---|
|START3-0| Starting point of line (0 thru 15 hex)|
|TEXTURE3-0| Line texture: shift value of the B source|
|LF7-0| Logic function minterm select lines. Should be preloaded with $4A to select the equation D=(AC+ABC). Since A contains a single bit true ($8000), most bits will pass the C field unchanged (not A and C), but one bit will invert the C field and combine it with texture (A and B and not C). The A bit is automatically moved across the word by the hardware.|
|LINE| Line mode control bit (set to 1)|
|SIGN| Sign flag|
|0| Reserved for new mode|
|SING| Single bit per horizontal line for use with subsequent area fill|
|SUD| Sometimes up or down (=AUD)|
|SUL| Sometimes up or left|
|AUL| Always up or left|

The 3 bits SUD, SUL and AUL select the octant for line drawing:

|Octant| SUD| SUL| AUL|
|---|---|---|---|
|0| 1| 1| 0|
|1| 0| 0| 1|
|2| 0| 1| 1|
|3| 1| 1| 1|
|4| 1| 0| 1|
|5| 0| 1| 0|
|6| 0| 0| 0|
|7| 1| 0| 0|

The "B" source is used for texturing the drawn lines.
