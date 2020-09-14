import sys
import json

# expects sys.argv[1] to be path for json file, formatted as per graasp research
with open(sys.argv[1]) as json_file:
    allData = json.load(json_file)
    for action in allData['data']['actions']:
        print('action id is: ' + action['_id'])
        # add anonymizing functionality
