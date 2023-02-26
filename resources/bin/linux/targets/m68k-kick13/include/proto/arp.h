#ifndef _PROTO_ARP_H
#define _PROTO_ARP_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif
#if !defined(CLIB_ARP_PROTOS_H) && !defined(__GNUC__)
#include <clib/arp_protos.h>
#endif

#ifndef __NOLIBBASE__
extern struct ArpBase *ArpBase;
#endif

#ifdef __GNUC__
#ifdef __AROS__
#include <defines/arp.h>
#else
#include <inline/arp.h>
#endif
#elif defined(__VBCC__)
#include <inline/arp_protos.h>
#else
#include <pragma/arp_lib.h>
#endif

#endif	/*  _PROTO_ARP_H  */
