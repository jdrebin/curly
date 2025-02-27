export default {
  name: "curly",
  rules: {
    "require-curly-braces": {
      create(ctx) {
        const errorMsg = "Missing curly braces";

        function handleNodeWithBody(
          node: Deno.lint.Node & { body: Deno.lint.Node },
        ) {
          ctx.report({ node: node.body, message: errorMsg });
        }

        return {
          "IfStatement[consequent.type!='BlockStatement']"(
            node: Deno.lint.IfStatement,
          ) {
            ctx.report({
              node: node.consequent,
              message: errorMsg,
            });
          },
          "IfStatement[alternate.type!='BlockStatement'][alternate.type!='IfStatement']"(
            node: Deno.lint.IfStatement & { alternate: Deno.lint.Node },
          ) {
            ctx.report({
              node: node.alternate,
              message: errorMsg,
            });
          },
          "WhileStatement[body.type!='BlockStatement']": handleNodeWithBody,
          "DoWhileStatement[body.type!='BlockStatement']": handleNodeWithBody,
          "ForStatement[body.type!='BlockStatement']": handleNodeWithBody,
          "ForInStatement[body.type!='BlockStatement']": handleNodeWithBody,
          "ForOfStatement[body.type!='BlockStatement']": handleNodeWithBody,
        };
      },
    },
  },
} as Deno.lint.Plugin;
