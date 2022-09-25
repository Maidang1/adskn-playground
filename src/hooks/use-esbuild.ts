import { useEffectOnce } from 'react-use';
import * as esbuild from 'esbuild-wasm';

export const useEsbuild = () => {
  useEffectOnce(() => {
    esbuild.initialize({
      worker: true,
      wasmURL: '/esbuild.wasm',
    });
  });
};
