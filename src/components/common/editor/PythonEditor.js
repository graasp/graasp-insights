import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  EDITOR_PROGRAMMING_LANGUAGES,
  PARAMETER_TYPES_PYTHON,
} from '../../../config/constants';
import Editor from './Editor';
import 'ace-builds/src-noconflict/mode-python';

const PythonEditor = ({ code, parameters, onCodeChange, readOnly, onSave }) => {
  useEffect(() => {
    // set the parameters in the python code using regex
    const newArgs = parameters
      .map(
        ({ name, type }) =>
          `\n        {'name': '${name}', 'type': ${PARAMETER_TYPES_PYTHON[type]}}`,
      )
      .join(',');

    const codeWithParameters = code.replace(
      /(?<=(args = parse_arguments\()).*?(?=\))/ms,
      `[${newArgs}\n    ]`,
    );

    onCodeChange(codeWithParameters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parameters]);

  return (
    <Editor
      code={code}
      programmingLanguage={EDITOR_PROGRAMMING_LANGUAGES.PYTHON}
      onCodeChange={onCodeChange}
      readOnly={readOnly}
      onSave={onSave}
    />
  );
};

PythonEditor.propTypes = {
  code: PropTypes.string,
  parameters: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      value: PropTypes.oneOf([
        PropTypes.number,
        PropTypes.string,
        PropTypes.shape({}),
      ]).isRequired,
    }),
  ),
  onCodeChange: PropTypes.func,
  readOnly: PropTypes.bool,
  onSave: PropTypes.func,
};

PythonEditor.defaultProps = {
  code: '',
  parameters: [],
  onCodeChange: () => {},
  readOnly: false,
  onSave: () => {},
};

export default PythonEditor;
