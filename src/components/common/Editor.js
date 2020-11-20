import React, { Component } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-xcode';
import 'ace-builds/src-noconflict/ext-language_tools';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { EDITOR_PROGRAMMING_LANGUAGES } from '../../config/constants';

class Editor extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    code: PropTypes.string,
    programmingLanguage: PropTypes.string,
    onCodeChange: PropTypes.func,
    readOnly: PropTypes.bool,
  };

  static defaultProps = {
    code: '',
    programmingLanguage: EDITOR_PROGRAMMING_LANGUAGES.PYTHON,
    onCodeChange: () => {},
    readOnly: false,
  };

  onChange = (code) => {
    const { onCodeChange } = this.props;
    onCodeChange(code);
  };

  render() {
    const { t, code, programmingLanguage, readOnly } = this.props;

    if (
      !Object.values(EDITOR_PROGRAMMING_LANGUAGES).includes(programmingLanguage)
    ) {
      return null;
    }

    const commentPrefix =
      programmingLanguage === EDITOR_PROGRAMMING_LANGUAGES.PYTHON ? '#' : '//';
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
        readOnly={readOnly}
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
