"""Verify if there is any potentially dangerous attribute in a Graasp dataset
"""

from graasp_utils import (load_dataset, parse_arguments, ValidationOutcome,
                          notify_validation_result)


def main():
    args = parse_arguments()

    dataset = load_dataset(args.dataset_path)
    has_user_name = False
    has_AP_settings = False
    has_API_data = False

    # verify in 'actions' if 'data' and 'geolocation' are present
    has_action_data = False
    has_action_geolocation = False
    actions = dataset['data']['actions']
    for action in actions:
        if 'data' in action:
            data = action['data']
            if data != None and data != '' and data != {}:
                has_action_data = True
        if 'geolocation' in action:
            geolocation = action['geolocation']
            if geolocation != None and geolocation != '' and geolocation != {}:
                has_action_geolocation = True

    # verify in 'users' if 'name' is present
    users = dataset['data']['users']
    for user in users:
        if 'name' in user:
            name = user['name']
            if name != None and name != '':
                has_user_name = True

    # verify in 'appInstances' if 'settings' is present
    appInstances = dataset['data']['appInstances']
    for ar in appInstances:
        if 'settings' in ar:
            settings = ar['settings']
            if settings != None and settings != '' and settings != {}:
                has_AP_settings = True

    # verify in 'appInstanceResources' if 'data' is present
    appInstanceResources = dataset['data']['appInstanceResources']
    for air in appInstanceResources:
        if 'data' in air:
            data = air['data']
            if data != None and data != '' and data != {}:
                has_API_data = True

    # issue a warning if any of these potentially dangerousattributes
    # are present
    potentially_dangerous = (has_action_data
                             or has_action_geolocation
                             or has_user_name
                             or has_AP_settings
                             or has_API_data)
    if potentially_dangerous:
        messages = ['Potentially dangerous attributes: ']
        if has_action_data:
            messages.append('- actions > data')
        if has_action_geolocation:
            messages.append('- actions > geolocation')
        if has_user_name:
            messages.append('- users > name')
        if has_AP_settings:
            messages.append('- appInstances > settings')
        if has_API_data:
            messages.append('- appInstanceResources > data')

        notify_validation_result(
            ValidationOutcome.WARNING, '\n'.join(messages))
    else:
        notify_validation_result(
            ValidationOutcome.SUCCESS, 'No potentially dangerous attributes')


if __name__ == '__main__':
    main()
