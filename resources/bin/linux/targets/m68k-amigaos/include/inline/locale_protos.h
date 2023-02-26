#ifndef _VBCCINLINE_LOCALE_H
#define _VBCCINLINE_LOCALE_H

#ifndef EXEC_TYPES_H
#include <exec/types.h>
#endif

VOID __CloseCatalog(__reg("a6") void *, __reg("a0") struct Catalog * catalog)="\tjsr\t-36(a6)";
#define CloseCatalog(catalog) __CloseCatalog(LocaleBase, (catalog))

VOID __CloseLocale(__reg("a6") void *, __reg("a0") struct Locale * locale)="\tjsr\t-42(a6)";
#define CloseLocale(locale) __CloseLocale(LocaleBase, (locale))

ULONG __ConvToLower(__reg("a6") void *, __reg("a0") struct Locale * locale, __reg("d0") ULONG character)="\tjsr\t-48(a6)";
#define ConvToLower(locale, character) __ConvToLower(LocaleBase, (locale), (character))

ULONG __ConvToUpper(__reg("a6") void *, __reg("a0") struct Locale * locale, __reg("d0") ULONG character)="\tjsr\t-54(a6)";
#define ConvToUpper(locale, character) __ConvToUpper(LocaleBase, (locale), (character))

VOID __FormatDate(__reg("a6") void *, __reg("a0") struct Locale * locale, __reg("a1") STRPTR fmtTemplate, __reg("a2") struct DateStamp * date, __reg("a3") struct Hook * putCharFunc)="\tjsr\t-60(a6)";
#define FormatDate(locale, fmtTemplate, date, putCharFunc) __FormatDate(LocaleBase, (locale), (fmtTemplate), (date), (putCharFunc))

APTR __FormatString(__reg("a6") void *, __reg("a0") struct Locale * locale, __reg("a1") STRPTR fmtTemplate, __reg("a2") APTR dataStream, __reg("a3") struct Hook * putCharFunc)="\tjsr\t-66(a6)";
#define FormatString(locale, fmtTemplate, dataStream, putCharFunc) __FormatString(LocaleBase, (locale), (fmtTemplate), (dataStream), (putCharFunc))

STRPTR __GetCatalogStr(__reg("a6") void *, __reg("a0") struct Catalog * catalog, __reg("d0") LONG stringNum, __reg("a1") STRPTR defaultString)="\tjsr\t-72(a6)";
#define GetCatalogStr(catalog, stringNum, defaultString) __GetCatalogStr(LocaleBase, (catalog), (stringNum), (defaultString))

STRPTR __GetLocaleStr(__reg("a6") void *, __reg("a0") struct Locale * locale, __reg("d0") ULONG stringNum)="\tjsr\t-78(a6)";
#define GetLocaleStr(locale, stringNum) __GetLocaleStr(LocaleBase, (locale), (stringNum))

BOOL __IsAlNum(__reg("a6") void *, __reg("a0") struct Locale * locale, __reg("d0") ULONG character)="\tjsr\t-84(a6)";
#define IsAlNum(locale, character) __IsAlNum(LocaleBase, (locale), (character))

BOOL __IsAlpha(__reg("a6") void *, __reg("a0") struct Locale * locale, __reg("d0") ULONG character)="\tjsr\t-90(a6)";
#define IsAlpha(locale, character) __IsAlpha(LocaleBase, (locale), (character))

BOOL __IsCntrl(__reg("a6") void *, __reg("a0") struct Locale * locale, __reg("d0") ULONG character)="\tjsr\t-96(a6)";
#define IsCntrl(locale, character) __IsCntrl(LocaleBase, (locale), (character))

BOOL __IsDigit(__reg("a6") void *, __reg("a0") struct Locale * locale, __reg("d0") ULONG character)="\tjsr\t-102(a6)";
#define IsDigit(locale, character) __IsDigit(LocaleBase, (locale), (character))

BOOL __IsGraph(__reg("a6") void *, __reg("a0") struct Locale * locale, __reg("d0") ULONG character)="\tjsr\t-108(a6)";
#define IsGraph(locale, character) __IsGraph(LocaleBase, (locale), (character))

BOOL __IsLower(__reg("a6") void *, __reg("a0") struct Locale * locale, __reg("d0") ULONG character)="\tjsr\t-114(a6)";
#define IsLower(locale, character) __IsLower(LocaleBase, (locale), (character))

BOOL __IsPrint(__reg("a6") void *, __reg("a0") struct Locale * locale, __reg("d0") ULONG character)="\tjsr\t-120(a6)";
#define IsPrint(locale, character) __IsPrint(LocaleBase, (locale), (character))

BOOL __IsPunct(__reg("a6") void *, __reg("a0") struct Locale * locale, __reg("d0") ULONG character)="\tjsr\t-126(a6)";
#define IsPunct(locale, character) __IsPunct(LocaleBase, (locale), (character))

BOOL __IsSpace(__reg("a6") void *, __reg("a0") struct Locale * locale, __reg("d0") ULONG character)="\tjsr\t-132(a6)";
#define IsSpace(locale, character) __IsSpace(LocaleBase, (locale), (character))

BOOL __IsUpper(__reg("a6") void *, __reg("a0") struct Locale * locale, __reg("d0") ULONG character)="\tjsr\t-138(a6)";
#define IsUpper(locale, character) __IsUpper(LocaleBase, (locale), (character))

BOOL __IsXDigit(__reg("a6") void *, __reg("a0") struct Locale * locale, __reg("d0") ULONG character)="\tjsr\t-144(a6)";
#define IsXDigit(locale, character) __IsXDigit(LocaleBase, (locale), (character))

struct Catalog * __OpenCatalogA(__reg("a6") void *, __reg("a0") struct Locale * locale, __reg("a1") STRPTR name, __reg("a2") struct TagItem * tags)="\tjsr\t-150(a6)";
#define OpenCatalogA(locale, name, tags) __OpenCatalogA(LocaleBase, (locale), (name), (tags))

#if !defined(NO_INLINE_STDARG) && (__STDC__ == 1L) && (__STDC_VERSION__ >= 199901L)
struct Catalog * __OpenCatalog(__reg("a6") void *, __reg("a0") struct Locale * locale, __reg("a1") STRPTR name, Tag tags, ...)="\tmove.l\ta2,-(a7)\n\tlea\t4(a7),a2\n\tjsr\t-150(a6)\n\tmovea.l\t(a7)+,a2";
#define OpenCatalog(locale, name, ...) __OpenCatalog(LocaleBase, (locale), (name), __VA_ARGS__)
#endif

struct Locale * __OpenLocale(__reg("a6") void *, __reg("a0") STRPTR name)="\tjsr\t-156(a6)";
#define OpenLocale(name) __OpenLocale(LocaleBase, (name))

BOOL __ParseDate(__reg("a6") void *, __reg("a0") struct Locale * locale, __reg("a1") struct DateStamp * date, __reg("a2") STRPTR fmtTemplate, __reg("a3") struct Hook * getCharFunc)="\tjsr\t-162(a6)";
#define ParseDate(locale, date, fmtTemplate, getCharFunc) __ParseDate(LocaleBase, (locale), (date), (fmtTemplate), (getCharFunc))

ULONG __StrConvert(__reg("a6") void *, __reg("a0") struct Locale * locale, __reg("a1") STRPTR string, __reg("a2") APTR buffer, __reg("d0") ULONG bufferSize, __reg("d1") ULONG type)="\tjsr\t-174(a6)";
#define StrConvert(locale, string, buffer, bufferSize, type) __StrConvert(LocaleBase, (locale), (string), (buffer), (bufferSize), (type))

LONG __StrnCmp(__reg("a6") void *, __reg("a0") struct Locale * locale, __reg("a1") STRPTR string1, __reg("a2") STRPTR string2, __reg("d0") LONG length, __reg("d1") ULONG type)="\tjsr\t-180(a6)";
#define StrnCmp(locale, string1, string2, length, type) __StrnCmp(LocaleBase, (locale), (string1), (string2), (length), (type))

#endif /*  _VBCCINLINE_LOCALE_H  */
