import sys
import json

# expects sys.argv[1] to be path for json file, formatted as per graasp research
with open(sys.argv[1]) as json_file:
    allData = json.load(json_file)
    with open(sys.argv[2], 'w+') as anonymizedFile:
        for action in allData['data']['actions']:
            if 'user' in action:
                action['user'] = format(hash(action['user']), 'x')
        for appInstanceResource in allData['data']['appInstanceResources']:
            if 'user' in appInstanceResource:
                appInstanceResource['user'] = format(hash(appInstanceResource['user']), 'x')
        json.dump(allData, anonymizedFile, indent=2)
