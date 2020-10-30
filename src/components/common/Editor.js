import React, { Component } from 'react';
import AceEditor from 'react-ace';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-xcode';
import 'ace-builds/src-noconflict/ext-language_tools';

class Editor extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    code: PropTypes.string,
    programmingLanguage: PropTypes.string,
    onCodeChange: PropTypes.func,
  };

  static defaultProps = {
    code: '',
    programmingLanguage: 'python',
    onCodeChange: () => {},
  };

  onChange = (code) => {
    const { onCodeChange } = this.props;
    onCodeChange(code);
  };

  render() {
    const { t, code, programmingLanguage } = this.props;

    const commentPrefix = programmingLanguage === 'python' ? '#' : '//';
    return (
      <AceEditor
        placeholder={`${commentPrefix} ${t('your code goes here')}`}
        mode={programmingLanguage}
        theme="xcode"
        onChange={this.onChange}
        highlightActiveLine
        value={code}
        width="100%"
        enableBasicAutocompletion
        enableLiveAutocompletion
        setOptions={{
          enableSnippets: true,
          showLineNumbers: true,
          tabSize: 2,
        }}
        editorProps={{ $blockScrolling: true }}
      />
    );
  }
}

export default withTranslation()(Editor);
