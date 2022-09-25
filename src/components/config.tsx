import { Select, Message, Space } from '@arco-design/web-react';
import { atom, useAtom, useAtomValue } from 'jotai';
import * as esbuild from 'esbuild-wasm';
import { codeEditorState, transformCodeEditorState } from '../store';
const { Option } = Select;
import * as monaco from 'monaco-editor';
import { throttle } from 'lodash-es';
import { useEffect } from 'react';

enum Theme {
  Vs = 'vs',
  VsDark = 'vs-dark',
  HcBlack = 'hc-black',
  HcLight = 'hc-light',
}

enum Language {
  JavaScript = 'javascript',
  TypeScript = 'typescript',
}

enum Target {
  Es2015 = 'es2015',
  Es2016 = 'es2016',
  Es2017 = 'es2017',
}
enum Format {
  CommonJs = 'cjs',
  Iife = 'iife',
  Esm = 'esm',
}

const options = [Language.JavaScript, Language.TypeScript];
const themeOptions = [Theme.Vs, Theme.VsDark, Theme.HcBlack, Theme.HcLight];
const targetOptions = [Target.Es2015, Target.Es2016, Target.Es2017];
const formatOptions = [Format.Iife, Format.CommonJs, Format.Esm];
export const languageAtom = atom(Language.TypeScript);
export const themeAtom = atom(Theme.VsDark);
export const targetAtom = atom(Target.Es2015);
export const formatAtom = atom(Format.Iife);

export const Config = () => {
  const [language, setLanguage] = useAtom(languageAtom);
  const [theme, setTheme] = useAtom(themeAtom);
  const [target, setTarget] = useAtom(targetAtom);
  const [format, setFormat] = useAtom(formatAtom);
  const codeEditor = useAtomValue(codeEditorState);
  const transformCodeEditor = useAtomValue(transformCodeEditorState);

  const handleEditorChange = throttle(async () => {
    const code = codeEditor!.getValue() || '';
    const result = await esbuild.transform(code, {
      loader: 'ts',
      target,
      format,
    });
    console.log('Config handleEditorChange', result.code);
    transformCodeEditor!.setValue(result.code);
  }, 1000);

  useEffect(() => {
    handleEditorChange();
  }, [target, format]);

  const handleLanguage = (language: string) => {
    setLanguage(language as Language);
  };

  const handleThemeChange = (theme: string) => {
    setTheme(theme as Theme);
    monaco.editor.setTheme(theme);
  };

  const handleTargetChange = (target: string) => {
    setTarget(target as Target);
  };

  const handleFormatChange = (format: string) => {
    setFormat(format as Format);
  };
  return (
    <div>
      <h1>config</h1>
      选择语言
      <Select value={language} onChange={handleLanguage}>
        {options.map((option, index) => (
          <Option value={option} key={index}>
            {option}
          </Option>
        ))}
      </Select>
      选择主题
      <Select value={theme} onChange={handleThemeChange}>
        {themeOptions.map((theme, index) => (
          <Option value={theme} key={index}>
            {theme}
          </Option>
        ))}
      </Select>
      选择 target
      <Select value={target} onChange={handleTargetChange}>
        {targetOptions.map((target, index) => (
          <Option value={target} key={index}>
            {target}
          </Option>
        ))}
      </Select>
      format
      <Select value={format} onChange={handleFormatChange}>
        {formatOptions.map((format, index) => (
          <Option value={format} key={index}>
            {format}
          </Option>
        ))}
      </Select>
    </div>
  );
};
