"""Ensure that for every combination of 'country', 'region', and 'city',
there are at least k users containing that combination"""

from graasp_utils import load_dataset, parse_arguments, save_dataset
from collections import Counter


def main():
    args = parse_arguments([
        {'name': 'k', 'type': int}
    ])

    dataset = load_dataset(args.dataset_path)

    actions = dataset['data']['actions']

    # get the geolocations for each user
    geolocations_per_user = {}
    for action in actions:
        if 'geolocation' in action:
            user = action['user']
            if user not in geolocations_per_user:
                geolocations_per_user[user] = []

            geoloc = action['geolocation']
            country = geoloc.get('country')
            region = geoloc.get('region')
            city = geoloc.get('city')
            geolocations_per_user[user].append((country, region, city))

    # get most represented geolocation for each user
    geolocation_mapping = {}
    for user, geolocations in geolocations_per_user.items():
        most_common = Counter(geolocations).most_common(1)
        if len(most_common) == 1:
            [((country, region, city), _)] = most_common
            geolocation_mapping[user] = {
                'country': country,
                'region': region,
                'city': city,
            }

    # group users by country then region then city
    grouped = {}
    for user, geo in geolocation_mapping.items():
        country = geo['country']
        region = geo['region']
        city = geo['city']

        if country not in grouped:
            grouped[country] = {
                'count': 0,
                'regions': {}
            }
        country_group = grouped[country]
        country_group['count'] += 1
        country_regions = country_group['regions']

        if region not in country_regions:
            country_regions[region] = {
                'count': 0,
                'cities': {}
            }
        region_group = country_regions[region]
        region_group['count'] += 1
        region_cities = region_group['cities']

        if city not in region_cities:
            region_cities[city] = {
                'count': 0,
                'users': []
            }
        city_group = region_cities[city]
        city_group['count'] += 1
        city_group['users'].append(user)

    # remove each value that is not represented at least k times
    for country, country_group in grouped.items():
        country_user_count = country_group.get('count', 0)
        regions = country_group.get('regions', {})
        for region, region_group in regions.items():
            region_user_count = region_group.get('count', 0)
            cities = region_group.get('cities', {})
            for city, city_group in cities.items():
                city_user_count = city_group.get('count', 0)
                users = city_group.get('users', [])
                if city_user_count < args.k:
                    for user in users:
                        geolocation_mapping[user]['city'] = ''
                if region_user_count < args.k:
                    for user in users:
                        geolocation_mapping[user]['region'] = ''
                if country_user_count < args.k:
                    for user in users:
                        geolocation_mapping[user]['country'] = ''

    # update with new values
    for action in actions:
        if 'geolocation' in action:
            user = action['user']
            action['geolocation'] = geolocation_mapping[user]

    save_dataset(dataset, args.output_path)


if __name__ == '__main__':
    main()
