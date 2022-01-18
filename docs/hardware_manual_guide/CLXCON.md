Register |Address|Read/Write |  Agnus/Denise/Paula     |    Function
-------- |-------| -----     |  -------   |    --------
CLXCON   |  098  |    W   |    D  |   Collision control

This register controls which bitplanes are
included (enabled) in collision detection and
their required state if included.  It also controls
the individual inclusion of odd-numbered sprites
in the collision detection by logically OR-ing
them with their corresponding even-numbered sprite.

BIT#|  FUNCTION | DESCRIPTION
---- | -------- | ------------------------------
15   | ENSP7   |  Enable sprite 7 (ORed with sprite 6)
14   | ENSP5   |  Enable sprite 5 (ORed with sprite 4)
13   | ENSP3   |  Enable sprite 3 (ORed with sprite 2)
12   | ENSP1  |   Enable sprite 1 (ORed with sprite 0)
11   | ENBP6  |   Enable bitplane 6 (match required for collision)
10  |  ENBP5  |   Enable bitplane 5 (match required for collision)
09  |  ENBP4  |   Enable bitplane 4 (match required for collision)
08  |  ENBP3  |   Enable bitplane 3 (match required for collision)
07  |  ENBP2  |   Enable bitplane 2 (match required for collision)
06  |  ENBP1  |   Enable bitplane 1 (match required for collision)
05  |  MVBP6  |   Match value for bitplane 6 collision
04  |  MVBP5  |   Match value for bitplane 5 collision
03  |  MVBP4  |   Match value for bitplane 4 collision
02  |  MVBP3  |   Match value for bitplane 3 collision
01  |  MVBP2  |   Match value for bitplane 2 collision
00  |  MVBP1  |   Match value for bitplane 1 collision

NOTE:  Disabled bitplanes cannot prevent
collisions.  Therefore if all bitplanes are
disabled, collisions will be continuous,
regardless of the match values.
