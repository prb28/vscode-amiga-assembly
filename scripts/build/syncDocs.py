"""Mirror the documentation from the m68k-instructions-documentation repository into docs/.

docs/ is a copy of https://github.com/prb28/m68k-instructions-documentation:
edit the documentation there, then run this script to update the extension.

Usage: python scripts/build/syncDocs.py [--source PATH] [--dry-run]
"""
import argparse
import filecmp
import os
import shutil
import sys

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.normpath(os.path.join(SCRIPT_DIR, "..", ".."))
DEST_DOCS = os.path.join(REPO_ROOT, "docs")
DEFAULT_SOURCE = os.path.normpath(os.path.join(
    REPO_ROOT, "..", "m68k-instructions-documentation"))

SYNCED_DIRS = ["instructions", "hardware",
               "directives", "libs", "hardware_manual_guide"]
SYNCED_FILES = ["toc.md"]


def list_files(root):
    files = set()
    if os.path.isdir(root):
        for dirpath, _, filenames in os.walk(root):
            for fname in filenames:
                files.add(os.path.relpath(
                    os.path.join(dirpath, fname), root))
    return files


def sync_file(src, dest, rel_path, dry_run, changes):
    if not os.path.exists(dest):
        changes.append("added    %s" % rel_path)
    elif not filecmp.cmp(src, dest, shallow=False):
        changes.append("updated  %s" % rel_path)
    else:
        return
    if not dry_run:
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        shutil.copyfile(src, dest)


def sync_dir(source, name, dry_run, changes):
    src_root = os.path.join(source, name)
    dest_root = os.path.join(DEST_DOCS, name)
    src_files = list_files(src_root)
    for rel in sorted(src_files):
        sync_file(os.path.join(src_root, rel), os.path.join(dest_root, rel),
                  os.path.join(name, rel), dry_run, changes)
    for rel in sorted(list_files(dest_root) - src_files):
        changes.append("removed  %s" % os.path.join(name, rel))
        if not dry_run:
            os.remove(os.path.join(dest_root, rel))


def main():
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--source", default=DEFAULT_SOURCE,
                        help="path of the m68k-instructions-documentation clone (default: %(default)s)")
    parser.add_argument("--dry-run", action="store_true",
                        help="only list the changes")
    args = parser.parse_args()

    source = os.path.abspath(args.source)
    missing = [d for d in SYNCED_DIRS + SYNCED_FILES
               if not os.path.exists(os.path.join(source, d))]
    if missing:
        sys.exit("Not a m68k-instructions-documentation clone: %s (missing %s)" %
                 (source, ", ".join(missing)))

    changes = []
    for name in SYNCED_DIRS:
        sync_dir(source, name, args.dry_run, changes)
    for name in SYNCED_FILES:
        sync_file(os.path.join(source, name), os.path.join(DEST_DOCS, name),
                  name, args.dry_run, changes)

    for change in changes:
        print(change)
    print("%d file(s) %s from %s" % (len(changes),
          "to change" if args.dry_run else "changed", source))


if __name__ == '__main__':
    main()
