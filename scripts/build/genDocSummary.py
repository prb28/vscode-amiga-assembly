import os
import os.path
import re


def processLibsNoDescription(libsPath):
    columnSize = 3
    column = 0
    md = ""
    # list all the files from the lib dir
    for dir in os.listdir(libsPath):
        parent = os.path.join(libsPath, dir)
        if (not dir.startswith(".")):
            md += "\n### %s\n" % dir
            md += "|     |     |     |\n|:---:|:---:|:---:|\n"
            column = 0
            for f in os.listdir(parent):
                if (not f.startswith('_')):
                    if (column == 0):
                        md += "|"
                    fname = f.replace(".md", "")
                    filepathname = os.path.join(parent, f)
                    fileurl = "libs/%s/%s" % (dir, fname)
                    md += "[%s](%s)|" % (fname, fileurl)
                    column += 1
                    if (column > 2):
                        md += "\n"
                        column = 0
            if (column != 0):
                md += "\n"
    return md


def readDescription(filepathname):
    with open(filepathname, "r") as f:
        contents = f.read()
        startPos = contents.find("**NAME**")
        endPos = contents.find("**SYNOPSIS**")
        if (startPos >= 0) and (endPos > startPos+8):
            subs = contents[startPos +
                            8:endPos].replace("\n", "").replace("\r", "").strip()
            minusPos = subs.find("--")
            if (minusPos > 0):
                return subs[minusPos+2:].strip()
            else:
                return subs
    return ""


def processLibs(libsPath):
    md = ""
    # list all the files from the lib dir
    for dir in os.listdir(libsPath):
        parent = os.path.join(libsPath, dir)
        if (not dir.startswith(".")):
            md += "\n### %s\n" % dir
            md += "| Function | Description |\n|:---|:---|\n"
            column = 0
            for f in os.listdir(parent):
                if (not f.startswith('_')):
                    fname = f.replace(".md", "")
                    filepathname = os.path.join(parent, f)
                    fileurl = "libs/%s/%s" % (dir, fname)
                    description = readDescription(filepathname)
                    md += "|[%s](%s)|%s|\n" % (fname, fileurl, description)
    return md


def createTOC(destPath, libsMd):
    # Load the reference
    contents = ""
    with open("toc.md", "r") as source:
        contents = source.read()
    contents = contents.replace("@amiga_libs_replacement@", libsMd)
    with open(os.path.join(destPath, "toc.md"), "w") as destination:
        destination.write(contents)


def displaymatch(match):
    if match is None:
        return None
    return '<Match: %r, groups=%r>' % (match.group(), match.groups())


if __name__ == '__main__':
    docsPath = os.path.join("..", "..", "docs")
    libsPath = os.path.join(docsPath, "libs")
    libsMd = processLibs(libsPath)
    createTOC(docsPath, libsMd)
