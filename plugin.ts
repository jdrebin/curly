export default {
  name: "no-shadow",
  rules: {
    "no-shadow": {
      create(ctx) {
        function next(node: Deno.lint.Node | null) {
          if (!node) return;
          switch (node.type) {
            case "Identifier":
              visitors.Identifier(node);
              return;
            case "ArrayPattern":
              visitors.ArrayPattern(node);
              return;
            case "ObjectPattern":
              visitors.ObjectPattern(node);
              return;
            case "AssignmentPattern":
              visitors.AssignmentPattern(node);
              return;
            case "RestElement":
              visitors.RestElement(node);
              return;
            case "Property":
              visitors.Property(node);
              return;
            default:
              return;
          }
        }

        const visitors = {
          Identifier(node) {
            //console.log(ctx.sourceCode.getAncestors(node));
            //console.log(node);
          },
          ArrayPattern(node) {
            return node.elements.map((element) => next(element));
          },
          ObjectPattern(node) {
            return node.properties.map((property) => next(property));
          },
          AssignmentPattern(node) {
            return next(node.left);
          },
          RestElement(node) {
            if (
              ["Identifier", "ArrayPattern", "ObjectPattern"].includes(
                node.argument.type,
              )
            ) {
              return next(node.argument);
            }
          },
          Property(node) {
            if (!node.value?.type) {
              if (node.key.type === "Identifier") {
                return visitors.Identifier(node.key);
              }
            } else if (
              [
                "Identifier",
                "ArrayPattern",
                "ObjectPattern",
                "AssignmentPattern",
              ].includes(node.value.type)
            ) {
              return next(node.value);
            }
          },
        } satisfies Deno.lint.LintVisitor;

        return {
          "VariableDeclarator, FunctionDeclaration[id.type=Identifier], ClassDeclaration[id.type=Identifier]"(
            node:
              | Deno.lint.FunctionDeclaration
              | Deno.lint.ClassDeclaration
              | Deno.lint.VariableDeclarator,
          ) {
            next(node.id);
          },
          "ImportDefaultSpecifier, ImportSpecifier"(
            node: Deno.lint.ImportDefaultSpecifier | Deno.lint.ImportSpecifier,
          ) {
            visitors.Identifier(node.local);
          },
          "CatchClause[param.type]"(
            node: Deno.lint.CatchClause,
          ) {
            next(node.param);
          },
          "*[params.length > 0][body.type]"(
            node: Deno.lint.Node & { params: Deno.lint.Parameter[] },
          ) {
            node.params.filter((param) => param.type !== "TSParameterProperty")
              .map((param) => next(param));
          },
          "Literal[value=3]"(node) {
            console.dir(ctx.sourceCode.getAncestors(node), { depth: 1 });
          },
          Program(node) {
            node.body.map((bod) => {
              switch (bod.type) {
                case "BlockStatement":
                  return;
                case "BreakStatement":
                  return;
                case "ClassDeclaration":
                  return;
                case "ContinueStatement":
                  return;
                case "DebuggerStatement":
                  return;
                case "DoWhileStatement":
                  return;
                case "ExportAllDeclaration":
                  return;
                case "ExportDefaultDeclaration":
                  return;
                case "ExportNamedDeclaration":
                  return;
                case "ExpressionStatement":
                  return;
                case "ForInStatement":
                  return;
                case "ForOfStatement":
                  return;
                case "ForStatement":
                  return;
                case "FunctionDeclaration":
                  return;
                case "IfStatement":
                  return;
                case "ImportDeclaration":
                  return;
                case "LabeledStatement":
                  return;
                case "ReturnStatement":
                  return;
                case "SwitchStatement":
                  return;
              }
            });
          },
        };
      },
    },
  },
} as Deno.lint.Plugin;
/**
 * what we're looking for;
 *
 * VariableDeclarator {
 *   Identifier
 * }
 * VariableDeclarator.ObjectPattern
 */

`
what we're looking for;

(1)VariableDeclarator.id, CatchClause.param, Parameter { // const ... <- = obj;
  (2)Identifier, //const a <- = 1;
  (3)ObjectPattern.properties {
    Property.value {
      Identifier, //const { a <- } = obj; const { a: b <- } = obj;
      AssignmentPattern.left = 1, //const { a: { b <- = 5 } } = obj;
      ArrayPattern.elements = 4,
    }
    RestElement.argument {
      Identifier, //const { ...rest } = obj;
    }
  }
  (4)ArrayPattern.elements {
    Identifier, //const [a <-] = arr;
    AssignmentPattern.left = 1, // const [a <- = 5] = arr;
    RestElement.argument {
      Identifier, //const [a, ...rest] = arr;
    }
    ObjectPattern.properties = 3,
    ArrayPattern.elements = 4,
  }
}

FunctionDeclaration.id,
ClassDeclaration.id,
ImportDefaultSpecifier.local,
ImportSpecifier.local {
  Identifier,
}
`;
