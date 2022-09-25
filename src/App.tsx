import * as esbuild from 'esbuild-wasm';
import * as monaco from 'monaco-editor';
import './App.css';
import { useMonaco } from './hooks/use-monaco';
import { useEsbuild } from './hooks/use-esbuild';
import { throttle } from 'lodash-es';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { codeEditorState, transformCodeEditorState, Editor } from './store';
import { useEffect, useRef } from 'react';
import {
  Config,
  languageAtom,
  targetAtom,
  themeAtom,
  formatAtom,
} from './components/config';
import { Layout } from '@arco-design/web-react';
const { Header, Content, Footer, Sider } = Layout;

function App() {
  useMonaco();
  useEsbuild();
  const updateCodeEditor = useSetAtom(codeEditorState);
  const updateTransformCodeEditor = useSetAtom(transformCodeEditorState);
  const language = useAtomValue(languageAtom) || 'javascript';
  const theme = useAtomValue(themeAtom);
  const target = useAtomValue(targetAtom);
  const format = useAtomValue(formatAtom);
  const editor = useRef<Editor>();
  const transformEditor = useRef<Editor>();
  let initialCode = `let code: string = 'hello world'\nconsole.log(code)`;

  useEffect(() => {
    if (editor.current) {
      editor.current.dispose();
    }
    if (transformEditor.current) {
      transformEditor.current.dispose();
    }
    editor.current = monaco.editor.create(
      document.getElementById('code-editor')!,
      {
        value: initialCode,
        language,
        theme,
      }
    );
    transformEditor.current = monaco.editor.create(
      document.getElementById('transform-editor')!,
      {
        value: '',
        language,
        theme,
        readOnly: true,
      }
    );
    updateTransformCodeEditor(transformEditor.current);
    updateCodeEditor(editor.current);
    editor.current.onDidChangeModelContent(handleEditorChange);
  }, [language]);

  const handleEditorChange = throttle(async () => {
    const code = editor.current!.getValue() || '';
    const result = await esbuild.transform(code, {
      loader: 'ts',
      target,
      format,
    });
    console.log(result.code);
    transformEditor.current!.setValue(result.code);
  }, 1000);

  return (
    <Layout
      style={{
        height: '100%',
      }}
    >
      <Header>this is a esbuild playground</Header>
      <Layout>
        <Sider>
          <div className='options'>
            <Config />
          </div>
        </Sider>
        <Content
          className='playground-container'
          style={{
            height: '100%',
          }}
        >
          <div id='code-editor' />
          <div id='transform-editor' />
        </Content>
      </Layout>

      <Footer>author by maidang</Footer>
    </Layout>
  );
}

export default App;
