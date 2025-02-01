const ts = require('typescript');
const parser = require('@babel/parser');

module.exports = function () {
  return {
    name: 'babel-plugin-native-class',
    visitor: {
      Program(path) {
        path.traverse({
          ClassDeclaration(classPath) {
            const { node } = classPath;

            if (hasNativeClassDecorator(node)) {
              const tsSource = classPath.hub.file.code;
              const transpiledCode = transpileClassToES5(node, tsSource);

              if (transpiledCode) {
                const babelAst = parser.parse(transpiledCode, {
                  sourceType: 'module',
                  plugins: ['typescript', 'decorators-legacy'],
                }).program.body;

                classPath.replaceWithMultiple(babelAst);
              }
            }
          },
        });
      },
    },
  };
};

function hasNativeClassDecorator(node) {
  return (
    node.decorators &&
    node.decorators.some(decorator => {
      const expression = decorator.expression;
      return expression.name === 'NativeClass' || (expression.callee && expression.callee.name === 'NativeClass');
    })
  );
}

function removeNativeClassDecorator(code, className) {
  const decoratorRegex = new RegExp(`@NativeClass(\\((.|\\n)*?\\))?\\s*class\\s+${className}`, 'gm');
  return code.replace(decoratorRegex, `class ${className}`);
}

function transpileClassToES5(node, sourceCode) {
  const className = node.id.name;
  const classStart = node.start;
  const classEnd = node.end;

  const classCode = sourceCode.slice(classStart, classEnd);
  const cleanedCode = removeNativeClassDecorator(classCode, className);

  const transpiled = ts.transpileModule(cleanedCode, {
    compilerOptions: {
      noEmitHelpers: true,
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES5,
      experimentalDecorators: true,
      emitDecoratorMetadata: true,
    },
  });

  return transpiled.outputText.replace(
    /(Object\.defineProperty\(.*?{.*?)(enumerable:\s*false)(.*?}\))/gs,
    '$1enumerable: true$3'
  );
}
