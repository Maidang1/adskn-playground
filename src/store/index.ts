import { atom } from 'jotai';
import type * as monaco from 'monaco-editor';

export type Editor = monaco.editor.IStandaloneCodeEditor;

export const codeEditorState = atom<Editor | null, Editor>(
  null,
  async (_get, set, update) => {
    console.log('codeEditorState', update);
    set(codeEditorState, update);
  }
);
export const transformCodeEditorState = atom<Editor | null, Editor>(
  null,
  async (_get, set, update) => {
    set(transformCodeEditorState, update);
  }
);
