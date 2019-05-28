import os
import os.path
import re


def read_description(filepathname):
    with open(filepathname, "r") as f:
        contents = f.read()
        start_pos = contents.find("**NAME**")
        end_pos = contents.find("**SYNOPSIS**")
        if (start_pos >= 0) and (end_pos > start_pos+8):
            subs = contents[start_pos +
                            8:end_pos].replace("\n", "").replace("\r", "").strip()
            minus_pos = subs.find("--")
            if (minus_pos > 0):
                return subs[minus_pos+2:].strip()
            else:
                return subs
    return ""


def process_libs(libs_path):
    md = ""
    # list all the files from the lib dir
    for dir in os.listdir(libs_path):
        parent = os.path.join(libs_path, dir)
        if (not dir.startswith(".")):
            md += "\n### %s\n" % dir
            md += "| Function | Description |\n|:---|:---|\n"
            for f in os.listdir(parent):
                if (not f.startswith('_')):
                    fname = f.replace(".md", "")
                    filepathname = os.path.join(parent, f)
                    fileurl = "libs/%s/%s" % (dir, fname)
                    description = read_description(filepathname)
                    md += "|[%s](%s)|%s|\n" % (fname, fileurl, description)
    return md


def read_register_description(filepathname):
    with open(filepathname, "r") as f:
        contents = f.readline()
        return contents.replace("**", "").replace("\n", "")
    return ""


def process_registers(registers_path):
    md = "| Address  | Name | Description |\n|:---|:---|:---|\n"
    # list all the files from the hardware dir
    for fname in os.listdir(registers_path):
        if (fname.endswith(".md")):
            name_elements = fname[:-3].split("_")
            register_address = name_elements[0]
            register_name = name_elements[1]
            filepathname = os.path.join(registers_path, fname)
            fileurl = "hardware/%s" % fname
            description = read_register_description(filepathname)
            md += "|%s|[%s](%s)|%s|\n" % (register_address,
                                          register_name, fileurl, description)
    return md


def create_toc(dest_path, libs_md, registers_md):
    # Load the reference
    contents = ""
    with open("toc.md", "r") as source:
        contents = source.read()
    contents = contents.replace("@amiga_registers_replacement@", registers_md)
    contents = contents.replace("@amiga_libs_replacement@", libs_md)
    with open(os.path.join(dest_path, "toc.md"), "w") as destination:
        destination.write(contents)


def displaymatch(match):
    if match is None:
        return None
    return '<Match: %r, groups=%r>' % (match.group(), match.groups())


if __name__ == '__main__':
    docsPath = os.path.join("..", "..", "docs")
    libsPath = os.path.join(docsPath, "libs")
    libsMd = process_libs(libsPath)
    registers_path = os.path.join(docsPath, "hardware")
    registersMd = process_registers(registers_path)
    create_toc(docsPath, libsMd, registersMd)
