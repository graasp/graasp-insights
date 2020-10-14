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
    collapsed: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  };

  static defaultProps = {
    content: Map(),
    size: 0,
    collapsed: true,
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
    const { content, size, t, collapsed } = this.props;
    const { json } = this.state;

    if (!content || !json) {
      return <Loader />;
    }

    if (size > MAX_FILE_SIZE) {
      return (
        <Typography>{t('This file is too big to be displayed.')}</Typography>
      );
    }

    return <ReactJson collapsed={collapsed} src={json} />;
  }
}

export default withTranslation()(JSONFileReader);
