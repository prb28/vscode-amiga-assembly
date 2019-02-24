#!/bin/sh

# To check the libs : otool -L fs-uae
# FS_UAE direct dependencies 
install_name_tool -change "/usr/local/opt/sdl2/lib/libSDL2-2.0.0.dylib" "@loader_path/libSDL2-2.0.0.dylib" fs-uae
install_name_tool -change "/usr/local/opt/glib/lib/libglib-2.0.0.dylib" "@loader_path/libglib-2.0.0.dylib" fs-uae
install_name_tool -change "/usr/local/opt/glib/lib/libgthread-2.0.0.dylib" "@loader_path/libgthread-2.0.0.dylib" fs-uae
install_name_tool -change "/usr/local/opt/gettext/lib/libintl.8.dylib" "@loader_path/libintl.8.dylib" fs-uae
install_name_tool -change "/usr/local/opt/libmpeg2/lib/libmpeg2.0.dylib" "@loader_path/libmpeg2.0.dylib" fs-uae
install_name_tool -change "/usr/local/opt/libmpeg2/lib/libmpeg2convert.0.dylib" "@loader_path/libmpeg2convert.0.dylib" fs-uae
install_name_tool -change "/usr/local/opt/libpng/lib/libpng16.16.dylib" "@loader_path/libpng16.16.dylib" fs-uae
# dependencies from libglib-2.0.0.dylib:
install_name_tool -change "/usr/local/opt/pcre/lib/libpcre.1.dylib" "@loader_path/libpcre.1.dylib" libglib-2.0.0.dylib
install_name_tool -change "/usr/local/opt/gettext/lib/libintl.8.dylib" "@loader_path/libintl.8.dylib" libglib-2.0.0.dylib
# dependencies from libgthread-2.0.0.dylib:
install_name_tool -change "/usr/local/Cellar/glib/2.56.1/lib/libglib-2.0.0.dylib" "@loader_path/libglib-2.0.0.dylib" libgthread-2.0.0.dylib
install_name_tool -change "/usr/local/opt/pcre/lib/libpcre.1.dylib" "@loader_path/libpcre.1.dylib" libgthread-2.0.0.dylib
install_name_tool -change "/usr/local/opt/gettext/lib/libintl.8.dylib" "@loader_path/libintl.8.dylib" libgthread-2.0.0.dylib
