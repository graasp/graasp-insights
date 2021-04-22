"""Scan an entire dataset for occurrences of user names and notify their
presence
"""

import re
import json
import platform

from graasp_utils import (load_dataset, parse_arguments, iterate_and_apply,
                          ValidationOutcome, notify_validation_result)


version = platform.python_version()[0]
if version == "3":
    def isstr(s):
        return isinstance(s, str)
else:
    def isstr(s):
        return isinstance(s, basestring)


def get_regex(name):
    """Creates a regex to match the name or any similar version"""
    # accepts up to 3 characters between each word and ignores case
    return '(?i)' + '.{0,3}'.join(name.split())


def find_names(dataset, names, matches):
    """Find occurances of names in a dataset using regular
    expressions
    """

    regexes = [get_regex(name) for name in names]

    def get_regex_matches(s):
        """Given a string, get the substrings that match a regex"""

        for reg in regexes:
            for match in re.findall(reg, s, re.IGNORECASE):
                if match not in matches:
                    matches.append(match)

    def traverse(current_data):
        if isinstance(current_data, list):
            for v in current_data:
                if isinstance(v, dict) or isinstance(v, list):
                    traverse(v)
                elif isstr(v):
                    get_regex_matches(v)

        elif isinstance(current_data, dict):
            for v in current_data.values():
                if isinstance(v, dict) or isinstance(v, list):
                    traverse(v)
                elif isstr(v):
                    get_regex_matches(v)

    traverse(dataset)


def main():
    args = parse_arguments([
        {'name': 'fields', 'type': str}
    ])

    # extract arguments
    dataset = load_dataset(args.dataset_path)
    original_dataset = load_dataset(args.original_path)
    fields = json.loads(args.fields)

    usernames = []
    iterate_and_apply(original_dataset, fields, usernames.append)

    # detect names by traversing the dataset
    matches = []
    find_names(dataset, usernames, matches)

    # notify the detected user names
    if len(matches) > 0:
        messages = ["Detected user names: "] + \
            ['  - %s' % m for m in matches[:10]]
        if len(matches) > 10:
            messages.append('  - ...')

        notify_validation_result(
            ValidationOutcome.FAILURE, '\n'.join(messages))
    else:
        notify_validation_result(
            ValidationOutcome.SUCCESS, 'No user name detected')


if __name__ == '__main__':
    main()
