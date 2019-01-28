from bs4 import BeautifulSoup as bs
import re, json

metadata = []

for d in ['standard', 'extended']:
    with open("./icons/theme-soho/src/%s.html" % d) as file:
        data = file.read()
        svgs = [x.strip() for x in data.split("\n\n")]
        l = []
        for s in svgs:
            match = re.search('id=\"icon-(.*?)\"', s)
            name = match.group(1)
            l.append(name)
            svg = s.replace('symbol', 'svg')
            svg = re.sub('id=\".*?\"', 'xmlns="http://www.w3.org/2000/svg"', svg)
            # Brute force pretty indentation
            prettySVG = re.sub('    ', '  ', svg)
            prettySVG = re.sub('  </svg>', '</svg>\n', prettySVG)
            print("Exporting %s/%s.svg" % (d, name))
            f = open( 'icons/theme-soho/svg/%s/%s.svg' % (d, name), 'w+' )
            f.write(prettySVG)
            f.close()
        metadata.append({"name": d, "icons": l})
m = open( 'icons/theme-soho/metadata.json', 'w+' )
json.dump(metadata, m, indent=4)
m.close()
