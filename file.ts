// deno-lint-ignore-file no-inner-declarations no-unused-vars ban-unused-ignore
const a = 1;
function fn(a: number) {
  for (const a of []) {
    const a = 2;
    class B {}
    // type a = number | ((a: number) => a);
    // const aa: a = (a) => (a) => (a) => a;
    // for (const a of []) {
    //   const a = 2;
    //   type a = number | ((a: number) => a);
    //   const aa: a = (a) => (a) => (a) => a;
    // }
    // for (const a of []) {
    //   const a = 2;
    //   type a = number | ((a: number) => a);
    //   const aa: a = (a) => {
    //     return (a) => {
    //       const b = 3;
    //       const c = 4;
    //       return (a) => a;
    //     };
    //   };
    // }
    for (let a = 0; a < 3; a++) {
      const a = 3;
    }
  }
}

//when at id, go through ancestors until block or for or params.
//if block, go up to all blocks, fors and and functions. when at a block check all body for names, when fn check all params' names, when for, check all left (or init) for names to compare. ignore current block because 'cant redeclare' will kick in.
//if in params, start checking after function,
//if in for, start checking after for.
//in first block, if its a function no need to check params, if its a for, need to check left because apparently it's legal to shadow in the left of a for.
//only need to check elements in the body that are above the current node but must check lower nodes for function names because functions can be accessed before they are declared.

const v = {
  ForOfStatement(node) {
    node.left; //VariableDeclaration
  },
  ForInStatement(node) {
    node.left; //VariableDeclaration
  },
  ForStatement(node) {
    node.init; //VariableDeclaration
  },
  BlockStatement(node) {
    node.body;
  },
} as Deno.lint.LintVisitor;

// var c = 1;
// const d = { a, b, e: c };
// const {} = d;
// const { e, b: f, a: g } = d;
// const h = [e, f, g];
// const [] = h;
// const [i, j, ...k] = h;
// const [l, m] = [1, 1];
// function n(o: number): number;
// function n(o: number) {
//   o = 1;
//   return o;
// }
// for (let p = 0; p < 2; p++) p;

// // Define an object with a property
// const obj = { prop: 0 as any };

// // Array with values
// const arr = [1, 2, 3];

// // Destructure the array and assign the second element directly to obj.prop
// [...(obj.prop)] = arr;
// ({ ...(obj.prop) } = obj);
// console.log(obj.prop); // 2
