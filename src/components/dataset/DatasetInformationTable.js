import React, { Component } from 'react';
import { connect } from 'react-redux';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import { getDataset } from '../../actions';
import {
  DEFAULT_LOCALE_DATE,
  DEFAULT_NUMBER_FORMAT,
} from '../../config/constants';

// eslint-disable-next-line react/prefer-stateless-function
class DatasetInformationTable extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({ id: PropTypes.string }).isRequired,
    }).isRequired,
    history: PropTypes.shape({
      goBack: PropTypes.func.isRequired,
    }).isRequired,
    t: PropTypes.func.isRequired,
    content: PropTypes.string,
  };

  static defaultProps = {
    content: null,
  };

  render() {
    const { content, t } = this.props;
    if (!content) {
      return null;
    }
    const parsedContent = JSON.parse(content)?.data || {};

    const actions = parsedContent?.actions?.filter((action) => action) || [];
    const actionCount = actions?.length.toLocaleString(DEFAULT_NUMBER_FORMAT);
    const userCount = parsedContent?.users
      ?.filter((user) => user)
      .length.toLocaleString(DEFAULT_NUMBER_FORMAT);
    const spaceInfo = parsedContent?.metadata?.spaceTree;
    const mainSpace = spaceInfo?.[0];
    const subSpaceCount = spaceInfo?.slice(1).length;
    const spaceName = mainSpace?.name || t('Unknown');
    const spaceId = mainSpace?.id;
    const countriesSet = new Set(
      actions
        ?.map(({ geolocation }) => geolocation?.country)
        .filter((country) => country),
    );
    const countryCount = [...countriesSet].length.toLocaleString(
      DEFAULT_NUMBER_FORMAT,
    );

    const dateRange =
      actions
        ?.map(({ createdAt }) =>
          createdAt
            ? new Date(createdAt).toLocaleDateString(DEFAULT_LOCALE_DATE)
            : null,
        )
        .filter((action) => action)
        .sort() || [];

    return (
      <TableContainer component={Paper}>
        <Table size="small">
          <TableBody>
            <TableRow key="spaceId">
              <TableCell component="th" scope="row">
                {t('Space ID')}
              </TableCell>
              <TableCell align="right">{spaceId || t('Unknown')}</TableCell>
            </TableRow>
            <TableRow key="spaceName">
              <TableCell component="th" scope="row">
                {t('Space Name')}
              </TableCell>
              <TableCell align="right">{spaceName || t('Unknown')}</TableCell>
            </TableRow>
            <TableRow key="subSpaceCount">
              <TableCell component="th" scope="row">
                {t('Subspace Count')}
              </TableCell>
              <TableCell align="right">{subSpaceCount || 0}</TableCell>
            </TableRow>
            <TableRow key="dateRange">
              <TableCell component="th" scope="row">
                {t('Date Range')}
              </TableCell>
              <TableCell align="right">
                {dateRange.length
                  ? `${dateRange[0]} - ${dateRange[dateRange.length - 1]}`
                  : t('Unknown')}
              </TableCell>
            </TableRow>
            <TableRow key="actionCount">
              <TableCell component="th" scope="row">
                {t('Action Count')}
              </TableCell>
              <TableCell align="right">{actionCount || t('Unknown')}</TableCell>
            </TableRow>
            <TableRow key="userCount">
              <TableCell component="th" scope="row">
                {t('User Count')}
              </TableCell>
              <TableCell align="right">{userCount || t('Unknown')}</TableCell>
            </TableRow>
            <TableRow key="countryCount">
              <TableCell component="th" scope="row">
                {t('Country Count')}
              </TableCell>
              <TableCell align="right">
                {countryCount || t('Unknown')}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}

const mapDispatchToProps = {
  dispatchGetDataset: getDataset,
};

const ConnectedComponent = connect(
  null,
  mapDispatchToProps,
)(DatasetInformationTable);

const TranslatedComponent = withTranslation()(ConnectedComponent);
export default withRouter(TranslatedComponent);
