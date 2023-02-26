/* struct Library */
#ifndef EXEC_LIBRARIES_H
#include <exec/libraries.h>
#endif

extern struct Library *PotgoBase;
long AllocPotBits(long);
void FreePotBits(long);
void WritePotgo(long, long);
