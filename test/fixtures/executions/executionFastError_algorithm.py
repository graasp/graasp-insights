''' Hash the userId field from the 'actions' and 'appInstanceResources' '''
import sys
import json
import hashlib

def sha256_hash(value):
    return hashlib.sha256(value.encode()).hexdigest()

hereIputsomeerror

# expects sys.argv[1] to be path for json file, formatted as per graasp research
with open(sys.argv[1]) as json_file:
    allData = json.load(json_file)
    with open(sys.argv[2], 'w+') as anonymizedFile:
        for action in allData['data']['actions']:
            if 'user' in action:
                action['user'] = sha256_hash(action['user'])
        for appInstanceResource in allData['data']['appInstanceResources']:
            if 'user' in appInstanceResource:
                appInstanceResource['user'] = sha256_hash(appInstanceResource['user'])
        json.dump(allData, anonymizedFile, indent=2)
