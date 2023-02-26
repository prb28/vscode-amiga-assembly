#ifndef __ASSERT_H
#define __ASSERT_H 1
#endif

#undef assert

extern int __aprintf(const char *,...);
extern void abort(void);

#ifndef NDEBUG
#define assert(exp) ((void)((exp)?0:(__aprintf("Assertion failed: file %s, line %d\n",__FILE__,__LINE__),abort(),0)))
#else
#define assert(exp)
#endif

