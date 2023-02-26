/* struct Library */
#ifndef EXEC_LIBRARIES_H
#include <exec/libraries.h>
#endif

extern struct Library *TranslatorBase;
long Translate(char *, long, char *, long);
