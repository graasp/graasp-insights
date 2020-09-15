import sys
import json

# expects sys.argv[1] to be path for json file, formatted as per graasp research
with open(sys.argv[1]) as json_file:
    allData = json.load(json_file)
    with open("anonymized_actions.json", "w+") as anonymizedFile:
        anonymizedFile.write('{"actions": ['),
        separator = '',
        for action in allData['data']['actions']:
            action['user'] = hash(action['user']),
            if (str(separator)[1:3] == repr('')):
                json.dump(action, anonymizedFile),
                separator = ','
            else:
                anonymizedFile.write(separator),
                json.dump(action, anonymizedFile),
        anonymizedFile.write(']}'),
    anonymizedFile.close()