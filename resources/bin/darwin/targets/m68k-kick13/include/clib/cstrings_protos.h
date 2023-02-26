/* struct Library */
#ifndef EXEC_LIBRARIES_H
#include <exec/libraries.h>
#endif

extern struct Library *CStringBase;
void TailPath(char *);
void bcopy(char *, char *, long);
void bzero(char *, long);
long index(char *, char *);
long rindex(char *, char *);
void scopy(char *);
void sfree(char *);
void strcat(char *, char *);
long strcmp(char *, char *);
void strcpy(char *, char *);
long strlen(char *);
void strncat(char *, char *, long);
long strncmp(char *, char *, long);
void strncpy(char *, char *, long);
void suffix(char *, char *);
