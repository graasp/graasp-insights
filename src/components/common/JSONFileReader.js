import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { Map } from 'immutable';
import ReactJson from 'react-json-view';
import { withTranslation } from 'react-i18next';
import Loader from './Loader';
import { MAX_FILE_SIZE } from '../../config/constants';

class JSONFileReader extends Component {
  static propTypes = {
    content: PropTypes.string,
    size: PropTypes.number,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    content: Map(),
    size: 0,
  };

  state = {
    json: null,
  };

  async componentDidMount() {
    const { content, size } = this.props;
    if (size < MAX_FILE_SIZE && content) {
      this.loadFile();
    }
  }

  async componentDidUpdate({ content: prevContent }) {
    const { content, size } = this.props;
    if (size < MAX_FILE_SIZE && content !== prevContent) {
      this.loadFile();
    }
  }

  loadFile = () => {
    const { content } = this.props;
    const parsedContent = JSON.parse(content);
    this.setState({ json: parsedContent });
  };

  render() {
    const { content, size, t } = this.props;
    const { json } = this.state;

    if (!content) {
      return <Loader />;
    }

    if (size > MAX_FILE_SIZE) {
      return (
        <Typography>{t('This file is too big to be displayed.')}</Typography>
      );
    }

    return <ReactJson collapsed src={json} />;
  }
}

export default withTranslation()(JSONFileReader);
