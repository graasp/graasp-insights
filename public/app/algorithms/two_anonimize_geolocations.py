''' Mask country, region and city attributes when necessary so that no user can be uniquely identified '''

import json, argparse

def load_dataset(dataset_path):
    ''' Load a json dataset from the specified path '''
    with open(dataset_path) as json_file:
        return json.load(json_file)

def save_dataset(dataset, dest_path):
    ''' Save a json dataset to the specified path '''
    with open(dest_path, 'w') as dest_file:
        json.dump(dataset, dest_file, indent=2)

def parse_arguments():
    ''' Parses command-line arguments. '''
    parser = argparse.ArgumentParser(description='Mask country, region and city attributes when necessary so that no user can be uniquely identified')
    parser.add_argument('dataset_path', help='path to the json dataset')
    parser.add_argument('output_path', default='output.json',
        help='destination path (including file name) for the output')

    return parser.parse_args()

def main():
    args = parse_arguments()

    dataset = load_dataset(args.dataset_path)

    actions = dataset['data']['actions']

    # get first geolocation for each user
    geolocations = {}
    for action in actions:
        user = action['user']
        if user not in geolocations:
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
        user = action['user']
        action['geolocation'] = geolocations[user]

    save_dataset(dataset, args.output_path)

if __name__ == '__main__':
    main()
