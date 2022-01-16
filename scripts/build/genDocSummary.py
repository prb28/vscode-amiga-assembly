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
            md += "\n### %s\n\n" % dir
            md += "| Function | Description |\n|:---|:---|\n"
            for f in os.listdir(parent):
                if (not f.startswith('_')):
                    fname = f
                    filepathname = os.path.join(parent, f)
                    fileurl = "libs/%s/%s" % (dir, fname)
                    description = read_description(filepathname)
                    md += "|[%s](%s)|%s|\n" % (fname.replace(".md",
                                                             ""), fileurl, description)
    return md


def process_instructions(instructions_path):
    md = "| Instructions  | Description |\n|:---|:---|\n"
    # list all the files from the hardware dir
    for fname in os.listdir(instructions_path):
        if (fname.endswith(".md")):
            name = fname[:-3]
            filepathname = os.path.join(instructions_path, fname)
            descElements = read_register_description(filepathname).split("-")
            if descElements and len(descElements) > 1:
                description = descElements[1]
            else:
                description = descElements[0]
            description = description.strip()
            md += "|[%s](%s)|%s|\n" % (name.replace("_", " "), "instructions/%s" %
                                       fname, description)
    return md


def read_register_description(filepathname):
    with open(filepathname, "r", encoding="utf-8") as f:
        contents = f.readline()
        return contents.replace("**", "").replace("\n", "").replace("\r", "")
    return ""


def read_directive_description(filepathname):
    with open(filepathname, "r", encoding="utf-8") as f:
        lines = f.readlines()
        return lines[8].replace(".\n", "")
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


def process_directives(directives_path):
    md = "| Directive | Description |\n|:---|:---|\n"
    # list all the files from the directives dir
    for fname in os.listdir(directives_path):
        if (fname.endswith(".md")):
            name = fname[:-3]
            filepathname = os.path.join(directives_path, fname)
            fileurl = "directives/%s" % fname
            description = read_directive_description(filepathname)
            md += "|[%s](%s)|%s|\n" % (name, fileurl, description)
    return md


def create_toc(dest_path, instructions_md, libs_md, registers_md, directives_md):
    # Load the reference
    contents = ""
    with open("toc.md", "r", encoding="utf-8") as source:
        contents = source.read()
    contents = contents.replace(
        "@amiga_instructions_replacement@", instructions_md)
    contents = contents.replace("@amiga_registers_replacement@", registers_md)
    contents = contents.replace("@amiga_libs_replacement@", libs_md)
    contents = contents.replace(
        "@amiga_directives_replacement@", directives_md)
    with open(os.path.join(dest_path, "toc.md"), "w", encoding="utf-8") as destination:
        destination.write(contents)


def displaymatch(match):
    if match is None:
        return None
    return '<Match: %r, groups=%r>' % (match.group(), match.groups())


if __name__ == '__main__':
    docsPath = os.path.join("..", "..", "docs")
    instructions_path = os.path.join(docsPath, "instructions")
    instructionsMd = process_instructions(instructions_path)
    libsPath = os.path.join(docsPath, "libs")
    libsMd = process_libs(libsPath)
    registers_path = os.path.join(docsPath, "hardware")
    registersMd = process_registers(registers_path)
    directives_path = os.path.join(docsPath, "directives")
    directivesMd = process_directives(directives_path)
    create_toc(docsPath, instructionsMd, libsMd, registersMd, directivesMd)
