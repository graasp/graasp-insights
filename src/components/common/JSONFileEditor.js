import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactJson from 'react-json-view';
import { withTranslation } from 'react-i18next';
import Loader from './Loader';
import { setDatasetFile } from '../../actions';

class JSONFileEditor extends Component {
  static propTypes = {
    content: PropTypes.string,
    t: PropTypes.func.isRequired,
    collapsed: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
    dispatchSetDatasetFile: PropTypes.func.isRequired,
    id: PropTypes.string,
    editEnabled: PropTypes.bool,
  };

  static defaultProps = {
    content: null,
    collapsed: true,
    id: null,
    editEnabled: false,
  };

  state = {
    json: null,
  };

  async componentDidMount() {
    const { content } = this.props;
    if (content) {
      this.loadFile();
    }
  }

  async componentDidUpdate({ content: prevContent }) {
    const { content } = this.props;
    if (content !== prevContent) {
      this.loadFile();
    }
  }

  loadFile = () => {
    const { content } = this.props;
    if (content) {
      const parsedContent = JSON.parse(content);
      this.setState({ json: parsedContent });
    }
  };

  handleEdit = ({ updated_src: content }) => {
    const { dispatchSetDatasetFile, id } = this.props;
    dispatchSetDatasetFile({ id, content });
  };

  render() {
    const { content, collapsed, editEnabled } = this.props;
    const { json } = this.state;

    if (!content || !json) {
      return <Loader />;
    }

    const editProps = editEnabled
      ? {
          onEdit: this.handleEdit,
          onAdd: this.handleEdit,
          onDelete: this.handleEdit,
        }
      : {};

    return (
      <ReactJson
        groupArraysAfterLength={50}
        collapsed={collapsed}
        src={json}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...editProps}
      />
    );
  }
}

const mapDispatchToProps = {
  dispatchSetDatasetFile: setDatasetFile,
};

const ConnectedComponent = connect(null, mapDispatchToProps)(JSONFileEditor);

export default withTranslation()(ConnectedComponent);
