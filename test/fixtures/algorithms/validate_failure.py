''' Validate a dataset with a failure '''

from graasp_utils import ValidationOutcome, notify_validation_result


def main():
    notify_validation_result(ValidationOutcome.FAILURE, "Failure")


if __name__ == '__main__':
    main()
