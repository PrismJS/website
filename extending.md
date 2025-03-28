---
title: Extending Prism
tagline: Prism is awesome out of the box, but it’s even awesomer when it’s customized to your own needs. This section will help you write new language definitions, plugins and all-around Prism hacking.
body_classes: language-javascript
resources:
  - https://plugins.prismjs.com/line-highlight/prism-line-highlight.css
  - https://plugins.prismjs.com/line-highlight/prism-line-highlight.js
  - https://plugins.prismjs.com/autoloader/prism-autoloader.js { data-autoloader-path="https://dev.prismjs.com/components/" }
---

<section>

# Language definitions

Every language is defined as a set of tokens, which are expressed as [regular expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions). For example, this is the language definition for JSON:

<pre data-src="https://dev.prismjs.com/components/prism-json.js"></pre>

At its core, a language definition is just a JavaScript object, and a token is just an entry of the language definition. The simplest language definition is an empty object:

```js
Prism.languages['some-language'] = { };
```

Unfortunately, an empty language definition isn't very useful, so let's add a token. The simplest way to express a token is using a regular expression literal:

```js
Prism.languages['some-language'] = {
	'token-name': /regex/,
};
```

Alternatively, an object literal can also be used. With this notation, the regular expression describing the token is the `pattern` property of the object:

```js
Prism.languages['some-language'] = {
	'token-name': {
		pattern: /regex/
	},
};
```

So far, the functionality is exactly the same between the regex and object notations. However, the object notation allows for [additional options](#object-notation). More on that later.

The name of a token can theoretically be any string that is also a valid CSS class, but there are [some guidelines to follow](#token-names). More on that later.

Language definitions can have any number of tokens, but the name of each token must be unique:

```js
Prism.languages['some-language'] = {
	'token-1': /I love regexes!/,
	'token-2': /regex/,
};
```

Prism will match tokens against the input text one after the other, in order, and tokens cannot overlap with the matches of previous tokens. So in the above example, `token-2`{ .language-none } will not match the substring "regex" inside of matches of `token-1`{ .language-none }. More information about [Prism's matching algorithm](#the-matching-algorithm) later.

Lastly, in many languages, there are multiple different ways of declaring the same constructs (e.g. comments, strings, ...) and sometimes it is difficult or unpractical to match all of them with one single regular expression. To add multiple regular expressions for one token name, an array can be used:

```js
Prism.languages['some-language'] = {
	'token-name': [
		/regex 1/,
		/regex 2/,
		{ pattern: /regex 3/ }
	],
};
```

Note: An array **cannot** be used in the `pattern` property.

## Object notation

Instead of using just plain regular expressions, Prism also supports an object notation for tokens. This notation enables the following options:

`pattern: RegExp` { id="object-notation-pattern" }

: This is the only required option. It holds the regular expression of the token.

`lookbehind: boolean` { id="object-notation-lookbehind" }

:	This option mitigates JavaScript's poor browser support for lookbehinds. When set to `true`, the first capturing group in the `pattern` regex is discarded when matching this token, so it effectively functions as a lookbehind.

	For an example of this, check out how the C-like language definition finds `class-name`{ .language-none } tokens:

	```
	Prism.languages.clike = {
		// ...
		'class-name': {
			pattern: /(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+)\w+/i,
			lookbehind: true
		}
	};
	```

`greedy: boolean` { id="object-notation-greedy" }

: This option enables greedy matching for the token. For more information, see the section about [the matching algorithm](#the-matching-algorithm).

`alias: string | string[]` { id="object-notation-alias" }

:	This option can be used to define one or more aliases for the token. The result will be that the styles of the token name and the alias(es) are combined. This can be useful to combine the styling of a [standard token](/tokens.html), which is already supported by most of the themes, with a more precise token name. For more information on this topic, see [granular highlighting](#granular-highlighting).

	E.g. the token name `latex-equation`{ .language-none } is not supported by most themes, but it will be highlighted the same as a string in the following example:

	```js
	Prism.languages.latex = {
		// ...
		'latex-equation': {
			pattern: /\$.*?\$/,
			alias: 'string'
		}
	};
	```

`inside: Grammar` { id="object-notation-inside }

: This option accepts another object literal, with tokens that are allowed to be nested in this token. All tokens in the `inside` grammar will be encapsulated by this token. This makes it easier to define certain languages.

	For an example of nested tokens, check out the `url` token in the CSS language definition:

	```
	Prism.languages.css = {
		// ...
		'url': {
			// e.g. url(https://example.com)
			pattern: /\burl\(.*?\)/i,
			inside: {
				'function': /^url/i,
				'punctuation': /^\(|\)$/
			}
		}
	};
	```

	The `inside` option can also be used to create recursive languages. This is useful for languages where one token can contain arbitrary expressions, e.g. languages with a string interpolation syntax.

	For example, here is how JavaScript implements template string interpolation:

	```
	Prism.languages.javascript = {
		// ...
		'template-string': {
			pattern: /`(?:\\.|\$\{[^{}]*\}|(?!\$\{)[^\\`])*`/,
			inside: {
				'interpolation': {
					pattern: /\$\{[^{}]*\}/,
					inside: {
						'punctuation': /^\$\{|\}$/,
						'expression': {
							pattern: /[\s\S]+/,
							inside: null // see below
						}
					}
				}
			}
		}
	};
	Prism.languages.javascript['template-string'].inside['interpolation'].inside['expression'].inside = Prism.languages.javascript;
	```

	Be careful when creating recursive grammars as they might lead to infinite recursion which will cause a stack overflow.

## Token names

The name of a token determines the _semantic meaning_ of matched text of the token. Tokens can capture anything from simple language constructs, like comments, to more complex ones, like template string interpolation expressions. Token names differentiate these language constructs.

A token name can theoretically be any string that is a valid CSS class name. However, in practice, it makes sense for token names to follow some rules. In Prism's code, we enforce that all token names use kebab case (`foo-bar`{ .language-none }) and contain only lower-case ASCII letters, digits, and hyphen characters. E.g. `class-name`{ .language-none } is allowed but `Class_name`{ .language-none } is not.

Prism also defines some [standard tokens names](tokens.html) that should be used for most tokens.

### Themes

Prism's themes assign color (and other styles) to tokens based on their name (and aliases). This means that the language definition does not control the color of tokens, themes do.

However, themes only support a limited number of **known token names**. If a theme does not know a particular token name, no styles will be applied. While different themes may support different token names, all themes are guaranteed to support Prism's [standard tokens](tokens.html). Standard tokens as special token names with specific semantic meanings. They are the common ground all language definitions and themes agree on and must follow. Standard tokens should be preferred when choosing token names.

### Granular highlighting

While standard tokens should be the preferred choice, they are also quite general. This is by design as they have to apply to a large number and variety of different languages, but sometimes more fine-grained tokenization (and subsequent highlighting) is desirable.

Granular highlighting is a method of choosing token names to enable fine control for themes, while also ensuring compatibility with all themes.

Let's look at an example. Say we had a language that supported both decimal and binary literals for numbers, and we wanted to give binary number special highlighting. We might implement it like this:

```js
Prism.languages['my-language'] = {
	// ...
	'number': /\b\d+(?:\.\d+)?\b/,
	'binary-number': /\b0b[01]+\b/,
};
```

But this has a problem. `binary-number`{ .language-none } is not a standard token, so almost no theme is going to given binary numbers any color.

The solution to this problem is to use an _alias_:

```js
Prism.languages['my-language'] = {
	// ...
	'number': /\b\d+(?:\.\d+)?\b/,
	'binary-number': {
		pattern: /\b0b[01]+\b/,
		alias: 'number'
	},
};
```

Aliases allow themes to apply the styles of multiple names to one token. This means that themes that do support the `binary-number`{ .language-none } token name can assign a special color, and themes don't support it will fallback to their usual color for numbers.

This is granular highlighting: using a non-standard token name and a standard token as an alias.

## The matching algorithm

The job of Prism's matching algorithm is to produce a token stream given a language definition and some text. A token stream is Prism's representation of (partially or fully) tokenized text and is implemented as a list of strings (representing literal text) and tokens (representing tokenized text).

_Note:_ The word "token" is ambiguous here. We use "token" to refer to both the entry of a language definition (as described in above sections) and a [Token object](docs/Token.html) inside a token stream. Which type of "token" is meant can be inferred from context.

The simplified token stream notation will be used in this section. Briefly, the notation uses JSON to represent a token stream. E.g. `["foo ", ["keyword", "bar"], " baz"]` is the simplified token stream notation for the token stream that starts with the string `foo`{ .language-none }, is followed by a token of type `keyword`{ .language-none } and text `bar`{ .language-none }, and ends with the string `baz`{ .language-none }.

Back to the matching algorithm: Prism's matching algorithm is a hybrid with two modes: first-come, first-served (FCFS) matching and greedy matching.

### FCFS matching

This is Prism default matching mode. All tokens are matched one after the other, in order, tokens cannot overlap, and tokens cannot match text that is already matched by previous tokens.

The algorithm itself is quite simple. Let's say we wanted to tokenize the JS code `max(3, 5, exp2(7));` and that function tokens had already been processed. The current token stream would be:

```
[
	["function", "max"],
	"(3, 5, ",
	["function", "exp2"],
	"(7));"
]
```

Next, we would tokenize numbers with the token `'number': /[0-9]+/`.

FCFS matching will go through all strings in the current token stream to find matches for the number regex. The first string is `"(3, 5, "`, so the match `3` is found. A new token is created for `3` and inserted into the token stream to replace the matching text. The token stream is now:

```
[
	["function", "max"],
	"(",
	["number", "3"],
	", 5, ",
	["function", "exp2"],
	"(7));"
]
```

Now, the algorithm goes to the next string `", 5, "` and finds another match. A new token is created for `5` and the token stream is now:

```
[
	["function", "max"],
	"(",
	["number", "3"],
	", ",
	["number", "5"],
	", ",
	["function", "exp2"],
	"(7));"
]
```

The next string is `", "` and no matches are found. The string after that is `"(7));"` and a new token is create for `7`:

```
[
	["function", "max"],
	"(",
	["number", "3"],
	", ",
	["number", "5"],
	", ",
	["function", "exp2"],
	"(",
	["number", "7"],
	"));"
]
```

The last string to check is `"));"` and no matches are found. The number token has now been processed and the algorithm will go process the next token in the language definition.

Notice how FCFS matching did not find the `2` in `exp2`. Since FCFS matching completely ignores existing tokens in the token stream, the number regex cannot see already-tokenized text. This is a very useful property. In the above example, `2` is a part of the function name `exp2`, so highlighting it as a number would be incorrect.

### Greedy matching

Greedy matching is very similar to FCFS matching. All tokens are matched in order and tokens cannot overlap. The defining difference is that greedy tokens **can** match the text of previous tokens.

Let's look at an example to see why greedy matching is useful and how it works _conceptually_. A very simplified version of JavaScript's comment and string syntax might be implemented like this:

```
Prism.languages.javascript = {
	'comment': /\/\/.*/,
	'string': /'(?:\\.|[^\\\r\n])*'/
};
```

To understand why greedy matching is useful, let's look at how FCFS matching would tokenize the text `'http://example.com'`:

FCFS matching starts with the token stream `["'http://example.com'"]` and tries to find matches for `'comment': /\/\/.*/`. The match `//example.com'`{ .language-none } is found and inserted into the token stream:

```
[
	"'http:",
	["comment", "//example.com'"]
]
```

Then FCFS matching will search for matches for `'string': /'(?:\\.|[^'\\\r\n])*'/`. The first string of the token stream, `"'http:"`, does not match the string regex, so the token stream remains unchanged. The string token has now been processed and the above token stream is the final result.

Obviously, this is bad. The code `'http://example.com'` is clearly just a string containing a URL, but FCFS matching doesn't understand this.

An obvious, but incorrect, fix might be to swap the order of `comment` and `string`. This would fix `'http://example.com'`. However, the problem was merely moved. Comments like `// it's my co-worker's code` (note the two single quotes) will now be tokenized incorrectly.

This is **the problem greedy matching solves**. Let's make the tokens greedy and then see how this affects the result:

```
Prism.languages.javascript = {
	'comment': {
		pattern: /\/\/.*/,
		greedy: true
	},
	'string': {
		pattern: /'(?:\\.|[^'\\\r\n])*'/,
		greedy: true
	}
};
```

While the actual greedy matching algorithm is quite complex and littered with subtle edge cases, its effect quite simple: a list of **greedy tokens will behave as if they were matched by a single regex**. This is how greedy matching works _conceptually_ and how you should think about greedy tokens.

This means that the greedy comment and string tokens will behave like the following language definition, but the combined token will result in the correct token names of the original greedy tokens:

```
Prism.languages.javascript = {
	'comment-or-string': /\/\/.*|'(?:\\.|[^'\\\r\n])*'/
};
```

In the above example, `'http://example.com'` will be matched by `/\/\/.*|'(?:\\.|[^'\\\r\n])*'/` completely. Since the `'(?:\\.|[^'\\\r\n])*'`{ .language-none } part of the regex caused the match, a token of type `string` will be created and the following token stream will be produced:

```
[
	["string", "'http://example.com'"]
]
```

Similarly, the tokenization will also be correct for the `// it's my co-worker's code` example.

When deciding whether a token should be greedy, use the following guide lines:

1. Most tokens are not greedy.
   
   Most tokens in most languages are not greedy, because they don't need to be. Typically only the comment, string, and regex literal tokens need to be greedy. All other tokens can use FCFS matching.
   
   Generally, a token should only be greedy if it can contain the start of another token.
   
2. All tokens before a greedy token should also be greedy.
   
   Greedy matching works subtly differently if there are non-greedy tokens before a greedy token. This typically leads to subtle and hard-to-catch bugs that sometimes take years to uncover.
   
   To make sure that greedy matching works as expected, the greedy tokens should be the first tokens of a language.
   
3. Greedy tokens come in groups.
   
   If a language definition contains only a single greedy token, then the greedy token shouldn't be greedy. As explained above, greedy matching conceptually combines the regexes of all greedy tokens into one. If there is only one greedy token, greedy matching will behave like FCFS matching.
{ .indent }

## Helper functions

Prism also provides some useful function for creating and modifying language definitions. [`Prism.languages.insertBefore`](docs/Prism.languages.html#.insertBefore) can be used to modify existing languages definitions. [`Prism.languages.extend`](docs/Prism.languages.html#.extend) is useful for when your language is very similar to another existing language.

## The rest property

The `rest` property in language definitions is special. Prism expects this property to be another language definition instead of a token. The tokens of the grammar in the `rest` property will be appended to the end of the language definition with the `rest` property. It can be thought of as a built-in object spread operator.

This is useful for referring to tokens defined elsewhere. However, the `rest` property should be used sparingly. When referencing another language, it is typically better to encapsulate the text of the language into a token and use [the `inside` property](#object-notation-inside) instead.

</section>

<section class="language-none">

# Creating a new language definition

This section will explain the usual workflow of creating a new language definition.

As an example, we will create the language definition of the fictional _Foo's Binary, Artistic Robots™_ language or just Foo Bar for short.

1. Create a new file `components/prism-foo-bar.js`.
   
   In this example, we choose `foo-bar` as the id of the new language. The language id has to be unique and should work well with the `language-xxxx` CSS class name Prism uses to refer to language definitions. Your language id should ideally match the regular expression `/^[a-z][a-z\d]*(?:-[a-z][a-z\d]*)*$/`.
   
2. Edit [`components.json`](https://github.com/PrismJS/prism/blob/master/components.json) to register the new language by adding it to the `languages` object. (Please note that all language entries are sorted alphabetically by title.)  
   Our new entry for this example will look like this:
   
   ```json
   "foo-bar": {
   	"title": "Foo Bar",
   	"owner": "Your GitHub name"
   }
   ```
   
   If your language definition depends any other languages, you have to specify this here as well by adding a `"require"`{ .language-js } property. E.g. `"require": "clike"`{ .language-js }, or `"require": ["markup", "css"]`{ .language-js }. For more information on dependencies read the [declaring dependencies](#declaring-dependencies) section.
   
   _Note:_ Any changes made to `components.json` require a rebuild (see step 3).
   
3. Rebuild Prism by running `npm run build`{ .language-bash }.
   
   This will make your language available to the [test page](test.html), or more precise: your local version of it. You can open your local `test.html` page in any browser, select your language, and see how your language definition highlights any code you input.
   
   _Note:_ You have to reload the test page to apply changes made to `prism-foo-bar.js` but you don't have to rebuild Prism itself. However, if you change `components.json` (e.g. because you added a dependency) then these changes will not show up on the test page until you rebuild Prism.
   
4. Write the language definition.
   
   The [above section](#language-definitions) already explains the makeup of language definitions.
   
5. Adding aliases.
   
   Aliases for are useful if your language is known under more than just one name or there are very common abbreviations for your language (e.g. JS for JavaScript). Keep in mind that aliases are very similar to language ids in that they also have to be unique (i.e. there cannot be an alias which is the same as another alias of language id) and work as CSS class names.
   
   In this example, we will register the alias `foo` for `foo-bar` because Foo Bar code is stored in `.foo` files.
   
   To add the alias, we add this line at the end of `prism-foo-bar.js`:
   
   ```js
   Prism.languages.foo = Prism.languages['foo-bar'];
   ```
   
   Aliases also have to be registered in `components.json` by adding the `alias` property to the language entry. In this example, the updated entry will look like this:
   
   ```json
   "foo-bar": {
   	"title": "Foo Bar",
   	"alias": "foo",
   	"owner": "Your GitHub name"
   }
   ```
   
   _Note:_ `alias` can also be a string array if you need to register multiple aliases.
   
   Using `aliasTitles`, it's also possible to give aliases specific titles. In this example, this won't be necessary but a good example as to where this is useful is the markup language:
   
   ```json
   "markup": {
   	"title": "Markup",
   	"alias": ["html", "xml", "svg", "mathml"],
   	"aliasTitles": {
   		"html": "HTML",
   		"xml": "XML",
   		"svg": "SVG",
   		"mathml": "MathML"
   	},
   	"option": "default"
   }
   ```
   
6. Adding tests.
   
   Create a folder `tests/languages/foo-bar/`. This is where your test files will live. The test format and how to run tests is described [here](test-suite.html).
   
   You should add a test for every major feature of your language. Test files should test the common case and certain edge cases (if any). Good examples are [the tests of the JavaScript language](https://github.com/PrismJS/prism/tree/master/tests/languages/javascript).
   
   You can use this template for new `.test` files:
   
   ```json
   The code to test.
   
   ----------------------------------------------------
   
   ----------------------------------------------------
   
   Brief description.
   ```
   
   For every test file:
   
   1. Add the code to test and a brief description.
      
   2. Verify that your language definition correctly highlights the test code. This can be done using your local version of the test page.  
      _Note:_ Using the _Show tokens_ options, you see the token stream your language definition created.
      
   3. Once you **carefully checked** that the test case is handled correctly (i.e. by using the test page), run the following command:
      
      `npm run test:languages -- --language=foo-bar --accept`{ .language-bash }
      
      This command will take the token stream your language definition currently produces and inserted into the test file. The empty space between the two lines separating the code and the description of test case will be replaced with a [simplified version of the token stream](test-suite.html#explaining-the-simplified-token-stream).
      
   4. **Carefully check** that the inserted token stream JSON is what you expect.
      
   5. Re-run `npm run test:languages -- --language=foo-bar`{ .language-bash } to verify that the test passes.
   { .indent }
7. Add an example page.
   
   Create a new file `examples/prism-foo-bar.html`. This will be the template containing the example markup. Just look at other examples to see how these files are structured.  
   We don't have any rules as to what counts as an example, so a single _Full example_ section where you present the highlighting of the major features of the language is enough.
   
8. Run `npm test`{ .language-bash } to check that _all_ tests pass, not just your language tests.  
   This will usually pass without problems. If you can't get all the tests to pass, skip this step.
   
9. Run `npm run build`{ .language-bash } again.
   
   Your language definition is now ready!
{ .indent }

</section>

<section class="language-none">

# Dependencies

Languages and plugins can depend on each other, so Prism has its own dependency system to declare and resolve dependencies.

## Declaring dependencies

You declare a dependency by adding a property to the entry of your language or plugin in the [`components.json`](https://github.com/PrismJS/prism/blob/master/components.json) file. The name of the property will be dependency kind and its value will be the component id of the dependee. If multiple languages or plugins are depended upon then you can also declare an array of component ids.

In the following example, we will use the `require` dependency kind to declare that a fictional language Foo depends on the JavaScript language and that another fictional language Bar depends on both JavaScript and CSS.

```{ .language-json data-line="8,12" }
{
	"languages": {
		"javascript": { "title": "JavaScript" },
		"css": { "title": "CSS" },
		...,
		"foo": {
			"title": "Foo",
			"require": "javascript"
		},
		"bar": {
			"title": "Bar",
			"require": ["css", "javascript"]
		}
	}
}
```

### Dependency kinds

There are 3 kinds of dependencies:

`require`

: Prism will ensure that all dependees are loaded before the depender.  
	You are **not** allowed to modify the dependees unless they are also declared as `modify`.

	This kind of dependency is most useful if you e.g. extend another language or dependee as an embedded language (e.g. like PHP is embedded in HTML).

`optional`

: Prism will ensure that an optional dependee is loaded before the depender if the dependee is loaded. Unlike `require` dependencies which also guarantee that the dependees are loaded, `optional` dependencies only guarantee the order of loaded components.  
	You are **not** allowed to modify the dependees. If you need to modify the optional dependee, declare it as `modify` instead.

	This kind of dependency is useful if you have embedded languages but you want to give the users a choice as to whether they want to include the embedded language. By using `optional` dependencies, users can better control the bundle size of Prism by only including the languages they need.  
	E.g. HTTP can highlight JSON and XML payloads but it doesn't force the user to include these languages.

`modify`

: This is an `optional` dependency which also declares that the depender might modify the dependees.

	This kind of dependency is useful if your language modifies another language (e.g. by adding tokens).  
	E.g. CSS Extras adds new tokens to the CSS language.

To summarize the properties of the different dependency kinds:

|            | Non-optional | Optional   |
| ---------- | ------------ | ---------- |
| Read only  | `require`    | `optional` |
| Modifiable |              | `modify`   |

{ .stylish }

Note: You can declare a component as both `require` and `modify`.

## Resolving dependencies

We consider the dependencies of components an implementation detail, so they may change from release to release. Prism will usually resolve dependencies for you automatically. So you won't have to worry about dependency loading if you [download](download.html) a bundle or use the `loadLanguages` function in NodeJS, the [AutoLoader](https://plugins.prismjs.com/autoloader/), or our Babel plugin.

If you have to resolve dependencies yourself, use the `getLoader` function exported by [`dependencies.js`](https://github.com/PrismJS/prism/blob/master/dependencies.js). Example:

```js
const getLoader = require('prismjs/dependencies');
const components = require('prismjs/components');

const componentsToLoad = ['markup', 'css', 'php'];
const loadedComponents = ['clike', 'javascript'];

const loader = getLoader(components, componentsToLoad, loadedComponents);
loader.load(id => {
	require(`prismjs/components/prism-${id}.min.js`);
});
```

For more details on the `getLoader` API, check out the [inline documentation](https://github.com/PrismJS/prism/blob/master/dependencies.js).

</section>

<section>

# Writing plugins

Prism’s plugin architecture is fairly simple. To add a callback, you use `Prism.hooks.add(hookname, callback)`. `hookname` is a string with the hook id, that uniquely identifies the hook your code should run at. `callback` is a function that accepts one parameter: an object with various variables that can be modified, since objects in JavaScript are passed by reference. For example, here’s a plugin from the Markup language definition that adds a tooltip to entity tokens which shows the actual character encoded:

```js
Prism.hooks.add('wrap', function(env) {
	if (env.token === 'entity') {
		env.attributes['title'] = env.content.replace(/&amp;/, '&');
	}
});
```

Of course, to understand which hooks to use you would have to read Prism’s source. Imagine where you would add your code and then find the appropriate hook. If there is no hook you can use, you may [request one to be added](https://github.com/PrismJS/prism/issues), detailing why you need it there.

</section>

<section>

# API documentation

All public and stable parts of [Prism's API are documented here](https://prismjs.com/docs/).

</section>
