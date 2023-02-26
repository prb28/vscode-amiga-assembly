/* ERROR: struct WBObject doesn't exist and all those function using it
          are not documented at all, but they appears in XXX_FD files.
          In the includes for V36 appears the next message:
          "Use DiskObjects instead of obsolete WBObjects"
          And the functions handling WBObjects are not mor available. */

/* struct Library */
#ifndef EXEC_LIBRARIES_H
#include <exec/libraries.h>
#endif

/* struct DiskObject, struct FreeList */
#ifndef WORKBENCH_WORKBENCH_H 
#include <workbench/workbench.h>
#endif

extern struct Library *IconBase;

/*------ normal functions ---------------------------------------------*/
long AddFreeList(struct FreeList *, char *, long);
long BumpRevision(char *, char *);
char * FindToolType(char **, char *);
void FreeDiskObject(struct DiskObject *);
void FreeFreeList(struct FreeList *);
struct DiskObject *GetDiskObject(char *);
long MatchToolValue(char **, char *);
long PutDiskObject(char *, struct DiskObject *);
long GetIcon(char *, struct DiskObject *, struct FreeList *);
long PutIcon(char *, struct DiskObject *);
