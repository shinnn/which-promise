'use strong';

const path = require('path');

const test = require('tape');
const whichPromise = require('.');

test('whichPromise()', t => {
  t.plan(6);

  const binName = path.basename(process.execPath);

  whichPromise(binName).then(resolvedPath => {
    t.equal(resolvedPath, process.execPath, 'should find the first instance of an executable in the PATH.');
  }).catch(t.fail);

  whichPromise('eslint.js', {path: 'node_modules/eslint/bin'}).then(resolvedPath => {
    t.equal(
      resolvedPath,
      path.resolve('node_modules/eslint/bin/eslint.js'),
      'should support node-which options.'
    );
  }).catch(t.fail);

  whichPromise('__this_binary_does_not_exist__').then(t.fail, err => {
    t.equal(
      err.message,
      'not found: __this_binary_does_not_exist__',
      'should fail when it cannot resolve the path of an executable.'
    );
  }).catch(t.fail);

  whichPromise(123).then(t.fail, err => {
    t.strictEqual(
      err.constructor,
      TypeError,
      'should fail when the first argument is not a string.'
    );
  }).catch(t.fail);

  whichPromise(binName, {path: 123}).then(t.fail, err => {
    t.strictEqual(
      err.constructor,
      TypeError,
      'should fail when it takes invalid node-which options.'
    );
  }).catch(t.fail);

  whichPromise().then(t.fail, err => {
    t.strictEqual(err.constructor, TypeError, 'should fail when it takes no arguments.');
  }).catch(t.fail);
});
