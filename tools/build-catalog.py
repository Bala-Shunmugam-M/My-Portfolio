"""Refresh the navigation/explorer catalog after editing projects.html. No build required to serve."""
from html.parser import HTMLParser
from pathlib import Path
import json
import re

root = Path(__file__).resolve().parents[1]
class Catalog(HTMLParser):
    def __init__(self):
        super().__init__()
        self.items, self.current, self.field = [], None, None
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'a' and 'data-cat' in a:
            self.current = dict(href=a['href'], categories=a['data-cat'].split(), title='', description='', tags=[])
        if self.current is None: return
        classes = a.get('class', '').split()
        if 'proj-title' in classes: self.field = 'title'
        elif 'proj-desc' in classes: self.field = 'description'
        elif 'tag' in classes:
            self.field = 'tag'
            self.current['tags'].append('')
    def handle_data(self, data):
        if not self.current or not self.field: return
        if self.field == 'tag': self.current['tags'][-1] += data
        else: self.current[self.field] += data
    def handle_endtag(self, tag):
        if tag == 'a' and self.current:
            for key in ['title', 'description']:
                self.current[key] = re.sub(r'\s+', ' ', self.current[key]).strip()
            self.items.append(self.current)
            self.current, self.field = None, None
        elif (tag == 'h3' and self.field == 'title') or (tag == 'p' and self.field == 'description') or (tag == 'span' and self.field == 'tag'):
            self.field = None

catalog = Catalog()
catalog.feed((root / 'projects.html').read_text(encoding='utf-8'))
assert len(catalog.items) == len({p['href'] for p in catalog.items}), 'Duplicate project links'
assert all(p['title'] and p['description'] for p in catalog.items), 'Missing project content'
(root / 'js/project-catalog.js').write_text(
    '// Generated from projects.html by tools/build-catalog.py.\nwindow.PortfolioCatalog = ' + json.dumps(catalog.items, ensure_ascii=False, indent=2) + ';\n',
    encoding='utf-8', newline='\n')
print(f'Catalog refreshed: {len(catalog.items)} projects')
