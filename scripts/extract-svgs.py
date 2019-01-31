import re, json, os

metadata = []

for d in ['svg', 'svg-extended']:
    with open("../enterprise/src/components/icons/%s.html" % d) as file:
        data = file.read()
        symbol_count = data.count("<symbol")
        print(symbol_count, "icons in %s" % d)
        svgs = [x.strip() for x in data.split("\n\n")]
        del svgs[0:1] # Delete opening divs
        del svgs[-2:] # Delete closing divs
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
            # print("Exporting %s/%s.svg" % (d, name))
            path = 'tmp/%s' % d
            if not os.path.exists(path):
                os.makedirs(path)
            f = open( '%s/%s.svg' % (path, name), 'w+' )
            f.write(prettySVG)
            f.close()
        metadata.append({"name": d, "icons": l})
    print(len(os.listdir(path)), "icons in %s" % d)
m = open( 'tmp/metadata.json', 'w+' )
json.dump(metadata, m, indent=4)
m.close()
