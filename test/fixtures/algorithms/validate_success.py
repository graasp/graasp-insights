''' Validate a dataset with a success '''

from graasp_utils import ValidationOutcome, notify_validation_result


def main():
    notify_validation_result(ValidationOutcome.SUCCESS, "Successful")


if __name__ == '__main__':
    main()
