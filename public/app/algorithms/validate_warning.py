"""Validate a dataset with a warning"""

from graasp_utils import ValidationOutcome, notify_validation_result


def main():
    notify_validation_result(ValidationOutcome.WARNING, "Warning")


if __name__ == '__main__':
    main()
