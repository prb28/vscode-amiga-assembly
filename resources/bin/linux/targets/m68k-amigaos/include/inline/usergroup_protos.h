#ifndef _VBCCINLINE_USERGROUP_H
#define _VBCCINLINE_USERGROUP_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

int __ug_SetupContextTagList(__reg("a6") void *, __reg("a0") const UBYTE* pname, __reg("a1") struct TagItem * taglist)="\tjsr\t-30(a6)";
#define ug_SetupContextTagList(pname, taglist) __ug_SetupContextTagList(UserGroupBase, (pname), (taglist))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
int __ug_SetupContextTags(__reg("a6") void *, __reg("a0") const UBYTE* pname, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-30(a6)\n\tmovea.l\t(a7)+,a1";
#define ug_SetupContextTags(...) __ug_SetupContextTags(UserGroupBase, __VA_ARGS__)
#endif

int __ug_GetErr(__reg("a6") void *)="\tjsr\t-36(a6)";
#define ug_GetErr() __ug_GetErr(UserGroupBase)

const char * __ug_StrError(__reg("a6") void *, __reg("d1") LONG code)="\tjsr\t-42(a6)";
#define ug_StrError(code) __ug_StrError(UserGroupBase, (code))

uid_t __getuid(__reg("a6") void *)="\tjsr\t-48(a6)";
#define getuid() __getuid(UserGroupBase)

uid_t __geteuid(__reg("a6") void *)="\tjsr\t-54(a6)";
#define geteuid() __geteuid(UserGroupBase)

int __setreuid(__reg("a6") void *, __reg("d0") uid_t real, __reg("d1") uid_t eff)="\tjsr\t-60(a6)";
#define setreuid(real, eff) __setreuid(UserGroupBase, (real), (eff))

int __setuid(__reg("a6") void *, __reg("d0") uid_t id)="\tjsr\t-66(a6)";
#define setuid(id) __setuid(UserGroupBase, (id))

gid_t __getgid(__reg("a6") void *)="\tjsr\t-72(a6)";
#define getgid() __getgid(UserGroupBase)

gid_t __getegid(__reg("a6") void *)="\tjsr\t-78(a6)";
#define getegid() __getegid(UserGroupBase)

int __setregid(__reg("a6") void *, __reg("d0") gid_t real, __reg("d1") gid_t eff)="\tjsr\t-84(a6)";
#define setregid(real, eff) __setregid(UserGroupBase, (real), (eff))

int __setgid(__reg("a6") void *, __reg("d0") gid_t id)="\tjsr\t-90(a6)";
#define setgid(id) __setgid(UserGroupBase, (id))

int __getgroups(__reg("a6") void *, __reg("d0") int ngroups, __reg("a1") gid_t * groups)="\tjsr\t-96(a6)";
#define getgroups(ngroups, groups) __getgroups(UserGroupBase, (ngroups), (groups))

int __setgroups(__reg("a6") void *, __reg("d0") int ngroups, __reg("a1") const gid_t * groups)="\tjsr\t-102(a6)";
#define setgroups(ngroups, groups) __setgroups(UserGroupBase, (ngroups), (groups))

int __initgroups(__reg("a6") void *, __reg("a1") const char * name, __reg("d0") gid_t basegroup)="\tjsr\t-108(a6)";
#define initgroups(name, basegroup) __initgroups(UserGroupBase, (name), (basegroup))

struct passwd * __getpwnam(__reg("a6") void *, __reg("a1") const char * name)="\tjsr\t-114(a6)";
#define getpwnam(name) __getpwnam(UserGroupBase, (name))

struct passwd * __getpwuid(__reg("a6") void *, __reg("d0") uid_t uid)="\tjsr\t-120(a6)";
#define getpwuid(uid) __getpwuid(UserGroupBase, (uid))

void __setpwent(__reg("a6") void *)="\tjsr\t-126(a6)";
#define setpwent() __setpwent(UserGroupBase)

struct passwd * __getpwent(__reg("a6") void *)="\tjsr\t-132(a6)";
#define getpwent() __getpwent(UserGroupBase)

void __endpwent(__reg("a6") void *)="\tjsr\t-138(a6)";
#define endpwent() __endpwent(UserGroupBase)

struct group * __getgrnam(__reg("a6") void *, __reg("a1") const char * name)="\tjsr\t-144(a6)";
#define getgrnam(name) __getgrnam(UserGroupBase, (name))

struct group * __getgrgid(__reg("a6") void *, __reg("d0") gid_t gid)="\tjsr\t-150(a6)";
#define getgrgid(gid) __getgrgid(UserGroupBase, (gid))

void __setgrent(__reg("a6") void *)="\tjsr\t-156(a6)";
#define setgrent() __setgrent(UserGroupBase)

struct group * __getgrent(__reg("a6") void *)="\tjsr\t-162(a6)";
#define getgrent() __getgrent(UserGroupBase)

void __endgrent(__reg("a6") void *)="\tjsr\t-168(a6)";
#define endgrent() __endgrent(UserGroupBase)

char * __crypt(__reg("a6") void *, __reg("a0") const char * key, __reg("a1") const char * salt)="\tjsr\t-174(a6)";
#define crypt(key, salt) __crypt(UserGroupBase, (key), (salt))

char * __ug_GetSalt(__reg("a6") void *, __reg("a0") const struct passwd * user, __reg("a1") char * buffer, __reg("d0") ULONG size)="\tjsr\t-180(a6)";
#define ug_GetSalt(user, buffer, size) __ug_GetSalt(UserGroupBase, (user), (buffer), (size))

char * __getpass(__reg("a6") void *, __reg("a1") const char * prompt)="\tjsr\t-186(a6)";
#define getpass(prompt) __getpass(UserGroupBase, (prompt))

mode_t __umask(__reg("a6") void *, __reg("d0") mode_t mask)="\tjsr\t-192(a6)";
#define umask(mask) __umask(UserGroupBase, (mask))

mode_t __getumask(__reg("a6") void *)="\tjsr\t-198(a6)";
#define getumask() __getumask(UserGroupBase)

pid_t __setsid(__reg("a6") void *)="\tjsr\t-204(a6)";
#define setsid() __setsid(UserGroupBase)

pid_t __getpgrp(__reg("a6") void *)="\tjsr\t-210(a6)";
#define getpgrp() __getpgrp(UserGroupBase)

char * __getlogin(__reg("a6") void *)="\tjsr\t-216(a6)";
#define getlogin() __getlogin(UserGroupBase)

int __setlogin(__reg("a6") void *, __reg("a1") const char * buffer)="\tjsr\t-222(a6)";
#define setlogin(buffer) __setlogin(UserGroupBase, (buffer))

void __setutent(__reg("a6") void *)="\tjsr\t-228(a6)";
#define setutent() __setutent(UserGroupBase)

struct utmp * __getutent(__reg("a6") void *)="\tjsr\t-234(a6)";
#define getutent() __getutent(UserGroupBase)

void __endutent(__reg("a6") void *)="\tjsr\t-240(a6)";
#define endutent() __endutent(UserGroupBase)

struct lastlog * __getlastlog(__reg("a6") void *, __reg("d0") uid_t uid)="\tjsr\t-246(a6)";
#define getlastlog(uid) __getlastlog(UserGroupBase, (uid))

int __setlastlog(__reg("a6") void *, __reg("d0") uid_t uid, __reg("a0") char * name, __reg("a1") char * host)="\tjsr\t-252(a6)";
#define setlastlog(uid, name, host) __setlastlog(UserGroupBase, (uid), (name), (host))

struct UserGroupCredentials * __getcredentials(__reg("a6") void *, __reg("a0") struct Task * task)="\tjsr\t-258(a6)";
#define getcredentials(task) __getcredentials(UserGroupBase, (task))

#endif /*  _VBCCINLINE_USERGROUP_H  */
