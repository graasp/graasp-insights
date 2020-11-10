''' Ensure that for every combination of 'country', 'region', and 'city',
    there are at least two users containing that combination.
    The corresponding fields are suppressed (from 'city' to 'country') when necessary '''

from utils import load_dataset, save_dataset, parse_arguments

def main():
    args = parse_arguments()

    dataset = load_dataset(args.dataset_path)

    actions = dataset['data']['actions']

    # get first geolocation for each user
    geolocations = {}
    for action in actions:
        user = action['user']
        if user not in geolocations and 'geolocation' in action:
            geolocations[user] = action['geolocation']
            geolocations[user]['range'] = [0,0]
            geolocations[user]['timezone'] = ''
            geolocations[user]['ll'] = [0,0]
            geolocations[user]['area'] = ''
            geolocations[user]['metro'] = ''

    # group by country then region then city
    grouped = {}
    for user, geo in geolocations.items():
        country = geo['country']
        region = geo['region']
        city = geo['city']
        
        if country not in grouped:
            grouped[country] = {}
            
        country_group = grouped[country]
            
        if region not in country_group:
            country_group[region] = {}
            
        region_group = country_group[region]
            
        if city not in region_group:
            region_group[city] = []
            
        region_group[city].append(user)

    # remove each value that is not represented twice
    for country, regions in grouped.items():
        alone_country = len(regions) <= 1
        for region, cities in regions.items():
            alone_region = len(cities) <= 1
            for city, users in cities.items():
                alone_city = len(users) <= 1
                if alone_city:
                    user = users[0]
                    geolocations[user]['city'] = ''
                    if alone_region:
                        geolocations[user]['region'] = ''
                        if alone_country:
                            geolocations[user]['country'] = ''
                            geolocations[user]['eu'] = ''

    # update with new values
    for action in actions:
        if 'geolocation' in action:
            user = action['user']
            action['geolocation'] = geolocations[user]

    save_dataset(dataset, args.output_path)

if __name__ == '__main__':
    main()
