import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import { makeStyles } from '@material-ui/core/styles';
import CustomValueContainer from './custom/CustomValueContainer';
import { formatDisplayedSelection } from '../../utils/charts';

const useStyles = makeStyles((theme) => ({
  container: {
    marginRight: theme.spacing(3),
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
}));

// custom styling used by react-select (deviates from material-ui approach used in rest of app)
const styleConstants = {
  border: 'solid 1px #dfe3e9',
  borderRadius: '4px',
  fontSize: '0.8rem',
};

const customStyles = {
  menu: () => ({
    width: '250px',
    position: 'absolute',
    zIndex: 999999,
    backgroundColor: '#F7F7F7',
    ...styleConstants,
  }),
  control: () => ({
    display: 'flex',
    minWidth: '250px',
    maxWidth: '600px',
    backgroundColor: '#F7F7F7',
    ...styleConstants,
  }),
};

const UsersSelect = ({ allUsersConsolidated, setUsersToFilter }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [selectedUsers, setSelectedUsers] = useState([]);

  // custom option allowing us to select all users in the dropdown
  const allOption = {
    name: t('Select All'),
    value: '*',
  };

  const handleChange = (selectedUser) => {
    setSelectedUsers(selectedUser);
    setUsersToFilter(selectedUser);
  };

  return (
    <div className={classes.container}>
      <Select
        styles={customStyles}
        options={[allOption, ...allUsersConsolidated]}
        isMulti
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        allowSelectAll
        getOptionLabel={
          (option) =>
            // if users have been hashed, no names exist - hence use userIds
            option.name || `${formatDisplayedSelection(option._id)}`
          // eslint-disable-next-line react/jsx-curly-newline
        }
        placeholder={t('Filter by user...')}
        value={selectedUsers}
        onChange={(selected) => {
          if (
            selected !== null &&
            selected.length > 0 &&
            selected[selected.length - 1].value === allOption.value
          ) {
            return handleChange(allUsersConsolidated);
          }
          return handleChange(selected);
        }}
        components={{
          ValueContainer: CustomValueContainer,
        }}
      />
    </div>
  );
};

UsersSelect.propTypes = {
  allUsersConsolidated: PropTypes.arrayOf(PropTypes.object).isRequired,
  setUsersToFilter: PropTypes.func.isRequired,
};

export default UsersSelect;
