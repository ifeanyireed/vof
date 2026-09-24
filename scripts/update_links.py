import json
import os

with open("web-app/src/data/cloudinaryMap.json") as f:
    mapping = json.load(f)

# Sort keys by length descending to avoid prefix collision
keys = sorted([k for k in mapping.keys() if mapping[k]["cloudinary_url"]], key=lambda x: -len(x))

targets = [
    "web-app/src/data/blogs.ts",
    "web-app/src/data/gallery.ts",
    "web-app/src/data/outreachReports.ts",
    "web-app/src/app/about/page.tsx",
    "web-app/src/app/programs/page.tsx",
    "web-app/src/app/financial-reports/page.tsx",
    "web-app/src/app/admin/page.tsx",
    "web-app/src/app/blog/page.tsx",
    "web-app/src/app/blog/[slug]/page.tsx",
    "web-app/src/app/gallery/page.tsx",
    "web-app/src/app/outreach-reports/page.tsx",
    "web-app/src/app/page.tsx",
    "web-app/src/lib/api.ts",
    "backend/database/schema.go"
]

total_changes = 0

for target in targets:
    if not os.path.exists(target):
        continue
    with open(target, "r", encoding="utf-8") as f:
        content = f.read()

    file_changes = 0
    new_content = content
    for k in keys:
        cld_url = mapping[k]["cloudinary_url"]
        if not cld_url:
            continue
        
        # We replace inside quotes: "k" -> "cld_url", 'k' -> 'cld_url', `k` -> `cld_url`
        for q in ['"', "'", '`']:
            orig = f"{q}{k}{q}"
            repl = f"{q}{cld_url}{q}"
            if orig in new_content:
                count = new_content.count(orig)
                new_content = new_content.replace(orig, repl)
                file_changes += count

    if file_changes > 0:
        with open(target, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Updated {target}: {file_changes} image links updated to Cloudinary")
        total_changes += file_changes

print(f"\nTotal image links updated: {total_changes}")
