import CodeMirror from 'codemirror'
import 'codemirror/addon/dialog/dialog'
import 'codemirror/addon/dialog/dialog.css'
import 'codemirror/addon/edit/matchtags'
import 'codemirror/addon/fold/foldcode'
import 'codemirror/addon/fold/foldgutter'
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/xml-fold'
import 'codemirror/addon/hint/show-hint'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/hint/xml-hint'
import 'codemirror/addon/lint/lint'
import 'codemirror/addon/lint/lint.css'
import 'codemirror/addon/search/search'
import 'codemirror/addon/search/searchcursor'
import 'codemirror/addon/selection/active-line'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/xml/xml'

export const editor = CodeMirror(null, {
  mode: 'xml',
  readOnly: true,
  dragDrop: false,
  foldGutter: true,
  lineNumbers: true,
  lineWrapping: true,
  gutters: [
    'CodeMirror-lint-markers',
    'CodeMirror-linenumbers',
    'CodeMirror-foldgutter',
  ],
  styleActiveLine: true,
  matchTags: {
    bothTags: true,
  },
  extraKeys: {
    Tab: false,
  },
})
