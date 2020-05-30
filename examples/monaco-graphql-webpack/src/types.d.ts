// eslint-disable-next-line spaced-comment
/// <reference path='../../../node_modules/monaco-editor/monaco.d.ts'/>
// eslint-disable-next-line spaced-comment
/// <reference path='../../../packages/monaco-graphql/src/typings/monaco.d.ts'/>

declare module 'worker-loader!*' {
  class WebpackWorker extends Worker {
    constructor();
  }

  export default WebpackWorker;
}
