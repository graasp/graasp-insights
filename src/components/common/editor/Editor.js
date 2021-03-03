import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';
import { withTranslation } from 'react-i18next';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/theme-xcode';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core';
import { EDITOR_PROGRAMMING_LANGUAGES } from '../../../config/constants';

const styles = () => ({
  disabled: {
    background: '#eeeeee',
  },
});
class Editor extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    code: PropTypes.string,
    programmingLanguage: PropTypes.string,
    onCodeChange: PropTypes.func,
    readOnly: PropTypes.bool,
    onSave: PropTypes.func,
    classes: PropTypes.shape({
      disabled: PropTypes.string.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    code: '',
    programmingLanguage: EDITOR_PROGRAMMING_LANGUAGES.PYTHON,
    onCodeChange: () => {},
    readOnly: false,
    onSave: () => {},
  };

  onChange = (code) => {
    const { onCodeChange } = this.props;
    onCodeChange(code);
  };

  render() {
    const {
      t,
      code,
      programmingLanguage,
      readOnly,
      onSave,
      classes,
    } = this.props;

    if (
      !Object.values(EDITOR_PROGRAMMING_LANGUAGES).includes(programmingLanguage)
    ) {
      return null;
    }

    return (
      <AceEditor
        className={clsx({ [classes.disabled]: readOnly })}
        placeholder={t('your code goes here')}
        mode={programmingLanguage}
        theme={readOnly ? 'kuroir' : 'xcode'}
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
          tabSize: 4,
        }}
        editorProps={{ $blockScrolling: true }}
        commands={[
          {
            name: 'save',
            bindKey: { win: 'Ctrl-S', mac: 'Command-S' },
            exec: onSave,
          },
        ]}
      />
    );
  }
}

const StyledComponent = withStyles(styles)(Editor);

export default withTranslation()(StyledComponent);
