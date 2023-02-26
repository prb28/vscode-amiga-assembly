#ifndef _VBCCINLINE_SOCKET_H
#define _VBCCINLINE_SOCKET_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

LONG __socket(__reg("a6") void *, __reg("d0") LONG domain, __reg("d1") LONG type, __reg("d2") LONG protocol)="\tjsr\t-30(a6)";
#define socket(domain, type, protocol) __socket(SocketBase, (domain), (type), (protocol))

LONG __bind(__reg("a6") void *, __reg("d0") LONG s, __reg("a0") const struct sockaddr * name, __reg("d1") LONG namelen)="\tjsr\t-36(a6)";
#define bind(s, name, namelen) __bind(SocketBase, (s), (name), (namelen))

LONG __listen(__reg("a6") void *, __reg("d0") LONG s, __reg("d1") LONG backlog)="\tjsr\t-42(a6)";
#define listen(s, backlog) __listen(SocketBase, (s), (backlog))

LONG __accept(__reg("a6") void *, __reg("d0") LONG s, __reg("a0") struct sockaddr * addr, __reg("a1") LONG * addrlen)="\tjsr\t-48(a6)";
#define accept(s, addr, addrlen) __accept(SocketBase, (s), (addr), (addrlen))

LONG __connect(__reg("a6") void *, __reg("d0") LONG s, __reg("a0") const struct sockaddr * name, __reg("d1") LONG namelen)="\tjsr\t-54(a6)";
#define connect(s, name, namelen) __connect(SocketBase, (s), (name), (namelen))

LONG __sendto(__reg("a6") void *, __reg("d0") LONG s, __reg("a0") const UBYTE * msg, __reg("d1") LONG len, __reg("d2") LONG flags, __reg("a1") const struct sockaddr * to, __reg("d3") LONG tolen)="\tjsr\t-60(a6)";
#define sendto(s, msg, len, flags, to, tolen) __sendto(SocketBase, (s), (msg), (len), (flags), (to), (tolen))

LONG __send(__reg("a6") void *, __reg("d0") LONG s, __reg("a0") const UBYTE * msg, __reg("d1") LONG len, __reg("d2") LONG flags)="\tjsr\t-66(a6)";
#define send(s, msg, len, flags) __send(SocketBase, (s), (msg), (len), (flags))

LONG __recvfrom(__reg("a6") void *, __reg("d0") LONG s, __reg("a0") UBYTE * buf, __reg("d1") LONG len, __reg("d2") LONG flags, __reg("a1") struct sockaddr * from, __reg("a2") LONG * fromlen)="\tjsr\t-72(a6)";
#define recvfrom(s, buf, len, flags, from, fromlen) __recvfrom(SocketBase, (s), (buf), (len), (flags), (from), (fromlen))

LONG __recv(__reg("a6") void *, __reg("d0") LONG s, __reg("a0") UBYTE * buf, __reg("d1") LONG len, __reg("d2") LONG flags)="\tjsr\t-78(a6)";
#define recv(s, buf, len, flags) __recv(SocketBase, (s), (buf), (len), (flags))

LONG __shutdown(__reg("a6") void *, __reg("d0") LONG s, __reg("d1") LONG how)="\tjsr\t-84(a6)";
#define shutdown(s, how) __shutdown(SocketBase, (s), (how))

LONG __setsockopt(__reg("a6") void *, __reg("d0") LONG s, __reg("d1") LONG level, __reg("d2") LONG optname, __reg("a0") const void * optval, __reg("d3") LONG optlen)="\tjsr\t-90(a6)";
#define setsockopt(s, level, optname, optval, optlen) __setsockopt(SocketBase, (s), (level), (optname), (optval), (optlen))

LONG __getsockopt(__reg("a6") void *, __reg("d0") LONG s, __reg("d1") LONG level, __reg("d2") LONG optname, __reg("a0") void * optval, __reg("a1") LONG * optlen)="\tjsr\t-96(a6)";
#define getsockopt(s, level, optname, optval, optlen) __getsockopt(SocketBase, (s), (level), (optname), (optval), (optlen))

LONG __getsockname(__reg("a6") void *, __reg("d0") LONG s, __reg("a0") struct sockaddr * hostname, __reg("a1") LONG * namelen)="\tjsr\t-102(a6)";
#define getsockname(s, hostname, namelen) __getsockname(SocketBase, (s), (hostname), (namelen))

LONG __getpeername(__reg("a6") void *, __reg("d0") LONG s, __reg("a0") struct sockaddr * hostname, __reg("a1") LONG * namelen)="\tjsr\t-108(a6)";
#define getpeername(s, hostname, namelen) __getpeername(SocketBase, (s), (hostname), (namelen))

LONG __IoctlSocket(__reg("a6") void *, __reg("d0") LONG d, __reg("d1") ULONG request, __reg("a0") char * argp)="\tjsr\t-114(a6)";
#define IoctlSocket(d, request, argp) __IoctlSocket(SocketBase, (d), (request), (argp))

LONG __CloseSocket(__reg("a6") void *, __reg("d0") LONG d)="\tjsr\t-120(a6)";
#define CloseSocket(d) __CloseSocket(SocketBase, (d))

LONG __WaitSelect(__reg("a6") void *, __reg("d0") LONG nfds, __reg("a0") fd_set * readfds, __reg("a1") fd_set * writefds, __reg("a2") fd_set * execptfds, __reg("a3") struct timeval * timeout, __reg("d1") ULONG * maskp)="\tjsr\t-126(a6)";
#define WaitSelect(nfds, readfds, writefds, execptfds, timeout, maskp) __WaitSelect(SocketBase, (nfds), (readfds), (writefds), (execptfds), (timeout), (maskp))

void __SetSocketSignals(__reg("a6") void *, __reg("d0") ULONG SIGINTR, __reg("d1") ULONG SIGIO, __reg("d2") ULONG SIGURG)="\tjsr\t-132(a6)";
#define SetSocketSignals(SIGINTR, SIGIO, SIGURG) __SetSocketSignals(SocketBase, (SIGINTR), (SIGIO), (SIGURG))

LONG __getdtablesize(__reg("a6") void *)="\tjsr\t-138(a6)";
#define getdtablesize() __getdtablesize(SocketBase)

LONG __ObtainSocket(__reg("a6") void *, __reg("d0") LONG id, __reg("d1") LONG domain, __reg("d2") LONG type, __reg("d3") LONG protocol)="\tjsr\t-144(a6)";
#define ObtainSocket(id, domain, type, protocol) __ObtainSocket(SocketBase, (id), (domain), (type), (protocol))

LONG __ReleaseSocket(__reg("a6") void *, __reg("d0") LONG fd, __reg("d1") LONG id)="\tjsr\t-150(a6)";
#define ReleaseSocket(fd, id) __ReleaseSocket(SocketBase, (fd), (id))

LONG __ReleaseCopyOfSocket(__reg("a6") void *, __reg("d0") LONG fd, __reg("d1") LONG id)="\tjsr\t-156(a6)";
#define ReleaseCopyOfSocket(fd, id) __ReleaseCopyOfSocket(SocketBase, (fd), (id))

LONG __Errno(__reg("a6") void *)="\tjsr\t-162(a6)";
#define Errno() __Errno(SocketBase)

LONG __SetErrnoPtr(__reg("a6") void *, __reg("a0") void * errno_p, __reg("d0") LONG size)="\tjsr\t-168(a6)";
#define SetErrnoPtr(errno_p, size) __SetErrnoPtr(SocketBase, (errno_p), (size))

char * __Inet_NtoA(__reg("a6") void *, __reg("d0") ULONG in)="\tjsr\t-174(a6)";
#define Inet_NtoA(in) __Inet_NtoA(SocketBase, (in))

ULONG __inet_addr(__reg("a6") void *, __reg("a0") const UBYTE * cp)="\tjsr\t-180(a6)";
#define inet_addr(cp) __inet_addr(SocketBase, (cp))

ULONG __Inet_LnaOf(__reg("a6") void *, __reg("d0") LONG in)="\tjsr\t-186(a6)";
#define Inet_LnaOf(in) __Inet_LnaOf(SocketBase, (in))

ULONG __Inet_NetOf(__reg("a6") void *, __reg("d0") LONG in)="\tjsr\t-192(a6)";
#define Inet_NetOf(in) __Inet_NetOf(SocketBase, (in))

ULONG __Inet_MakeAddr(__reg("a6") void *, __reg("d0") ULONG net, __reg("d1") ULONG host)="\tjsr\t-198(a6)";
#define Inet_MakeAddr(net, host) __Inet_MakeAddr(SocketBase, (net), (host))

ULONG __inet_network(__reg("a6") void *, __reg("a0") const UBYTE * cp)="\tjsr\t-204(a6)";
#define inet_network(cp) __inet_network(SocketBase, (cp))

struct hostent  * __gethostbyname(__reg("a6") void *, __reg("a0") const UBYTE * name)="\tjsr\t-210(a6)";
#define gethostbyname(name) __gethostbyname(SocketBase, (name))

struct hostent  * __gethostbyaddr(__reg("a6") void *, __reg("a0") const UBYTE * addr, __reg("d0") LONG len, __reg("d1") LONG type)="\tjsr\t-216(a6)";
#define gethostbyaddr(addr, len, type) __gethostbyaddr(SocketBase, (addr), (len), (type))

struct netent   * __getnetbyname(__reg("a6") void *, __reg("a0") const UBYTE * name)="\tjsr\t-222(a6)";
#define getnetbyname(name) __getnetbyname(SocketBase, (name))

struct netent   * __getnetbyaddr(__reg("a6") void *, __reg("d0") LONG net, __reg("d1") LONG type)="\tjsr\t-228(a6)";
#define getnetbyaddr(net, type) __getnetbyaddr(SocketBase, (net), (type))

struct servent  * __getservbyname(__reg("a6") void *, __reg("a0") const UBYTE * name, __reg("a1") const UBYTE * proto)="\tjsr\t-234(a6)";
#define getservbyname(name, proto) __getservbyname(SocketBase, (name), (proto))

struct servent  * __getservbyport(__reg("a6") void *, __reg("d0") LONG port, __reg("a0") const UBYTE * proto)="\tjsr\t-240(a6)";
#define getservbyport(port, proto) __getservbyport(SocketBase, (port), (proto))

struct protoent * __getprotobyname(__reg("a6") void *, __reg("a0") const UBYTE * name)="\tjsr\t-246(a6)";
#define getprotobyname(name) __getprotobyname(SocketBase, (name))

struct protoent * __getprotobynumber(__reg("a6") void *, __reg("d0") LONG proto)="\tjsr\t-252(a6)";
#define getprotobynumber(proto) __getprotobynumber(SocketBase, (proto))

void __vsyslog(__reg("a6") void *, __reg("d0") ULONG level, __reg("a0") const char * format, __reg("a1") LONG * ap)="\tjsr\t-258(a6)";
#define vsyslog(level, format, ap) __vsyslog(SocketBase, (level), (format), (ap))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
void __syslog(__reg("a6") void *, __reg("d0") ULONG level, __reg("a0") const char * format, ...)="\tmove.l\ta1,-(a7)\n\tlea\t4(a7),a1\n\tjsr\t-258(a6)\n\tmovea.l\t(a7)+,a1";
#define syslog(level, ...) __syslog(SocketBase, (level), __VA_ARGS__)
#endif

LONG __Dup2Socket(__reg("a6") void *, __reg("d0") LONG fd1, __reg("d1") LONG fd2)="\tjsr\t-264(a6)";
#define Dup2Socket(fd1, fd2) __Dup2Socket(SocketBase, (fd1), (fd2))

LONG __sendmsg(__reg("a6") void *, __reg("d0") LONG s, __reg("a0") struct msghdr * msg, __reg("d1") LONG flags)="\tjsr\t-270(a6)";
#define sendmsg(s, msg, flags) __sendmsg(SocketBase, (s), (msg), (flags))

LONG __recvmsg(__reg("a6") void *, __reg("d0") LONG s, __reg("a0") struct msghdr * msg, __reg("d1") LONG flags)="\tjsr\t-276(a6)";
#define recvmsg(s, msg, flags) __recvmsg(SocketBase, (s), (msg), (flags))

LONG __gethostname(__reg("a6") void *, __reg("a0") STRPTR hostname, __reg("d0") LONG size)="\tjsr\t-282(a6)";
#define gethostname(hostname, size) __gethostname(SocketBase, (hostname), (size))

ULONG __gethostid(__reg("a6") void *)="\tjsr\t-288(a6)";
#define gethostid() __gethostid(SocketBase)

LONG __SocketBaseTagList(__reg("a6") void *, __reg("a0") struct TagItem * taglist)="\tjsr\t-294(a6)";
#define SocketBaseTagList(taglist) __SocketBaseTagList(SocketBase, (taglist))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
LONG __SocketBaseTags(__reg("a6") void *, LONG taglist, ...)="\tmove.l\ta0,-(a7)\n\tlea\t4(a7),a0\n\tjsr\t-294(a6)\n\tmovea.l\t(a7)+,a0";
#define SocketBaseTags(...) __SocketBaseTags(SocketBase, __VA_ARGS__)
#endif

LONG __GetSocketEvents(__reg("a6") void *, __reg("a0") ULONG * eventmaskp)="\tjsr\t-300(a6)";
#define GetSocketEvents(eventmaskp) __GetSocketEvents(SocketBase, (eventmaskp))

#endif /*  _VBCCINLINE_SOCKET_H  */
