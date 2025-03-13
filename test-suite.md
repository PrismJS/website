---
title: Running the test suite
tagline: Prism has a test suite, that ensures that the correct tokens are matched.
body_classes: "language-javascript"
scripts: <script src="https://dev.prismjs.com/components/prism-bash.js"></script>
---

<section>

# Running the test suite

Running the test suite is simple: just call `npm test`{ .language-bash }.

All test files are run in isolation. A new prism instance is created for each test case. This will slow the test runner a bit down, but we can be sure that nothing leaks into the next test case.

## Running tests for specific languages

To run the tests only for one language, you can use the `language` parameter:

```bash
npm run test:languages -- --language=markup
```

You can even specify multiple languages:

```bash
npm run test:languages -- --language=markup --language=css
```

</section>

<section>

# Writing tests

Thank you for writing tests! Tests are awesome! They ensure, that we can improve the codebase without breaking anything. Also, this way, we can ensure that upgrading Prism is as painless as possible for you.

You can add new tests by creating a new test case file (with the `.test` file extension) in the tests directory which is located at `/tests/languages/${language}`.

## Language directories

All tests are sorted into directories in the `tests/languages` directory. Each directory name encodes, which language you are currently testing.

**All language names must match the names from the definition in `components.json`.**

### Example 1: testing a language in isolation (default use case)

Just put your test file into the directory of the language you want to test.

So, if you want to test CSS, put your test file in `/tests/languages/css` to test CSS only. If you create a test case in this directory, the test runner will ensure that the `css` language definition including all required language definitions are correctly loaded.

### Example 2: testing language injection

If you want to test language injection, you typically need to load two or more languages where one language is the “main” language that is being tested, with all other languages being injected into it.

You need to define multiple languages by separating them using a `+` sign: `markup+php`.

The languages are loaded in order, so first markup (+ dependencies) is loaded, then php (+ dependencies). The test loader ensures that no language is loaded more than once (for example if two languages have the same dependencies).

By default the last language is the main language: `php+markup` will have `markup` as main language. This is equal to putting your code in the following code block:

```markup
...
<pre><code class="language-markup">
	<!-- your code here -->
</code><pre>
...
```

If you need to load the languages in a given order, but you don't want to use the last language as main language, you can mark the main language with an exclamation mark: `php!+markup`. This will use `php` as main language. (You can only define one main language. The test runner will fail all tests in directories with more than one main language.)

_Note: by loading multiple languages you can do integration tests (ensure that loading two or more languages together won't break anything)._

## Creating your test case file

At first you need to create a new file in the language directory, you want to test.

**Use a proper name for your test case.** Please use one case of the following conventions:

- `issue{issueid}`: reference a github issue id (example: `issue588.test`).
- `{featurename}_feature`: group all tests to one feature in one file (example: `string_interpolation_feature.test`).
- `{language}_inclusion`: test inclusion of one language into the other (example: `markup!+css/css_inclusion.test` will test CSS inclusion into markup).

You can use all conventions as a prefix, so `string_interpolation_feature_inline.test` is possible. **But please take a minute or two to think of a proper name of your test case file. You are writing code not only for the computers, but also for your fellow developers.**

## Writing your test

A test case file is built up of two or three sections separated by ten or more dashes `-` starting at the begin of the line. The sections are the following:

1. Your language snippet. The code you want to tokenize using Prism. (**required**)
2. The simplified token stream you expect. Needs to be valid JSON. (_optional_)  
   The test runner will automatically insert this if not present. **Carefully check** that the inserted token stream is what you expected.  
   If the test case fails because the JSON is present but incorrect, then you can use the [`--update` flag](#updating-tests) to overwrite it.
3. A brief comment explaining the test case. (_optional_)

Here is an example:

```
var a = 5;

----------------------------------------------------

[
	["keyword", "var"],
	" a ",
	["operator", "="],
	["number", "5"],
	["punctuation", ";"]
]

----------------------------------------------------

This is a comment explaining this test case.
```

## The easy way to write tests

The easy way to create one or multiple new test case(s) is this:

1. Create a new test case file `tests/languages/{language}/{test-case}.test`{ .language-none }.
2. Insert the code you want to test (and nothing more).
3. Repeat the first two steps for as many test cases as you want.
4. Run `npm run test:languages`{ .language-bash }.
5. Done.

Updating existing test case files is easy too!

1. Run `npm run test:languages -- --update`{ .language-bash }.
2. Done.

This works by making the test runner insert the actual token stream of you test code as the expected token stream. **Carefully check that the inserted token stream is actually what you expect or else the test is meaningless!**

## Updating tests

When creating and changing languages, their test files have to be updated to properly test the language. The rather tedious task of updating test files can be automated using the following command:

```bash
npm run test:languages -- --update
```

Updates (overwrites) the expected token stream of all failing test files. The language tests are guaranteed to pass after running this command.

_Keep in mind:_ This command makes it easy to create/update test files but this doesn't mean that the tests will be correct. **Always carefully check the inserted/updated token streams!**

## Explaining the simplified token stream

While highlighting, Prism transforms your source code into a token stream. This is basically a tree of nested tokens (or arrays, or strings).

As these trees are hard to write by hand, the test runner uses a simplified version of it.

It uses the following rules:

- `Token` objects are transformed into an array: `[token.type, token.content]` (whereas `token.content` can be a nested structure).
- All strings that are either empty or only contain whitespace, are removed from the token stream.
- All empty structures are removed.

The simplified token stream does not contain the aliases of a token.

For further information: reading the tests of the test runner (`tests/testrunner-tests.js`) will help you understand the transformation.

</section>

<section>

# Writing specific tests

Sometimes, using the token stream tests is not powerful enough. By creating a test file with the file extension `.html.test` instead of `.test`, you can make Prism highlight arbitrary pieces of code and check their HTML results.

The language is determined by the folder containing the test file lies, as explained in the previous section.

The structure of your test file will look like this, for example:

```html
&amp;
&#x41;

----------------------------------------------------

<span class="token entity named-entity" title="&amp;">&amp;amp;</span>
<span class="token entity" title="&#x41;">&amp;#x41;</span>

----------------------------------------------------

This is a comment explaining this test case.
```

</section>

<section>

# Test runner tests

The test runner itself is tested in a separate test case. You can find all “test core” related tests in `tests/testrunner-tests.js`.

You shouldn't need to touch this file ever, except you modify the test runner code.

</section>

<section>

# Internal structure

The global test flow is at follows:

1. Run all internal tests (test the test runner).
2. Find all language tests.
3. Run all language tests individually.
4. Report the results.

</section>
