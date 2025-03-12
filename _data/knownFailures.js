export default [
	{
		language: "applescript",
		failures: [
			{
				heading: "Comments only support one level of nesting",
				examples: [
					`(* Nested block
	(* comments
		(* on more than
		2 levels *)
	are *)
not supported *)`,
				],
			},
		],
	},
	{
		language: "autoit",
		failures: [
			{
				heading: "Nested block comments",
				examples: [
					`#cs
	#cs
		foo()
	#ce
#ce`,
				],
			},
		],
	},
	{
		language: "bison",
		failures: [
			{
				heading: "Two levels of nesting inside C section",
				examples: [
					`{
	if($1) {
		if($2) {

		}
	}
} // &lt;- Broken
%%
%%`,
				],
			},
		],
	},
	{
		language: "d",
		failures: [
			{
				heading: "Comments only support one level of nesting",
				examples: [`/+ /+ /+ this does not work +/ +/ +/`],
			},
			{
				heading: "Token strings only support one level of nesting",
				examples: [`q{ q{ q{ this does not work } } }`],
			},
		],
	},
	{
		language: "elixir",
		failures: [
			{
				heading: "String interpolation in single-quoted strings",
				examples: [`'#{:atom} &lt;- this should not be highlighted'`],
			},
		],
	},
	{
		language: "groovy",
		failures: [
			{
				heading: "Two divisions on the same line",
				examples: [`2 / 3 / 4`],
			},
		],
	},
	{
		language: "inform7",
		failures: [
			{
				heading: "Names starting with a number",
				examples: [`The box 1A is a container`],
			},
		],
	},
	{
		language: "javascript",
		failures: [
			{
				heading: "String interpolation containing a closing brace",
				examples: ["`${/* } */ a + b}`\n`${ '}' }`"],
			},
			{
				heading: "String interpolation with deeply nested braces",
				examples: ["`${foo({ a: { b: { c: true } } })}`"],
			},
		],
	},
	{
		language: "less",
		failures: [
			{
				heading: "At-rules looking like variables",
				examples: [`@import "some file.less";`],
			},
			{
				heading: "At-rules containing interpolation",
				examples: [`@import "@{themes}/tidal-wave.less";`],
			},
			{
				heading: "`extend` is not highlighted consistently",
				examples: [
					`nav ul {
  &:extend(.inline);
  background: blue;
}
.a:extend(.b) {}`,
				],
			},
		],
	},
	{
		language: "lua",
		failures: [
			{
				heading:
					"Functions with a single string parameter not using parentheses are not highlighted",
				examples: [`foobar"param";`],
			},
		],
	},
	{
		language: "nasm",
		failures: [
			{
				heading: "Numbers with underscores",
				examples: [
					`mov     ax,1100_1000b
mov     ax,1100_1000y
mov     ax,0b1100_1000
mov     ax,0y1100_1000

dd    1.222_222_222`,
				],
			},
		],
	},
	{
		language: "parser",
		failures: [
			{
				heading: "Code block starting with a comment",
				examples: [
					`# Doesn't work
# Does work`,
					" # Does work when prefixed with a space",
				],
			},
			{
				heading: "Comments inside expressions break literals and operators",
				examples: [
					`^if(
    $age>=4  # not too young
    && $age&lt;=80  # and not too old
)`,
				],
			},
		],
	},
	{
		language: "prolog",
		failures: [
			{
				heading: "Null-ary predicates are not highlighted",
				examples: [
					`halt.
trace.

:- if(test1).
section_1.
:- elif(test2).
section_2.
:- elif(test3).
section_3.
:- else.
section_else.
:- endif.`,
				],
			},
		],
	},
	{
		language: "puppet",
		failures: [
			{
				heading: "More than one level of nested braces inside interpolation",
				examples: [
					'"Foobar ${foo({\n\tbar => { baz => 42 }\n\tbaz => 42\n})} &lt;- broken"',
				],
			},
		],
	},
	{
		language: "python",
		failures: [
			{
				heading: "Interpolation expressions containing strings with `{` or `}`",
				examples: [`f"{'}'}"`],
			},
		],
	},
	{
		language: "q",
		failures: [
			{
				heading: "The global context is highlighted as a verb",
				examples: ["\\d ."],
			},
		],
	},
	{
		language: "rest",
		failures: [
			{
				heading: "Nothing is highlighted inside table cells",
				examples: [
					`+---------------+----------+
| column 1     | column 2  |
+--------------+-----------+
| **bold**?    | *italic*? |
+--------------+-----------+`,
				],
			},
			{
				heading:
					"The inline markup recognition rules are not as strict as they are in the spec",
				description: "No inline markup should be highlighted in the following code.",
				examples: [
					`2 * x a ** b (* BOM32_* \` \`\` _ __ |
"*" '|' (*) [*] {*} &lt;*> ‘*’ ‚*‘ ‘*‚ ’*’ ‚*’ “*” „*“ “*„ ”*” „*” »*« ›*‹ «*» »*» ›*›`,
				],
			},
		],
	},
	{
		language: "rust",
		failures: [
			{
				heading: "Nested block comments",
				examples: [
					`/* Nested block
	/* comments
	are */
not supported */`,
				],
			},
			{
				heading: "Delimiters of parameters for closures that don't use braces",
				examples: [`|x| x + 1i;`],
			},
		],
	},
	{
		language: "sass",
		failures: [
			{
				heading: "Deprecated Sass syntax is not supported",
				examples: [
					`.page
  color = 5px + 9px

!width = 13px
.icon
  width = !width`,
				],
			},
			{
				heading: "Selectors with pseudo classes are highlighted as property/value pairs",
				examples: [
					`a:hover
  text-decoration: underline`,
				],
			},
		],
	},
	{
		language: "scala",
		failures: [
			{
				heading: "Nested block comments",
				examples: [
					`/* Nested block
	/* comments
	are */
not supported */`,
				],
			},
		],
	},
	{
		language: "scheme",
		failures: [
			{
				heading:
					"The first argument of `case-lambda` argument lists are highlighted as functions",
				examples: [
					`(define plus
	(case-lambda
		(() 0)
		((x) x)
		((x y) (+ x y))
		((x y z) (+ (+ x y) z))
		(args (apply + args))))`,
				],
			},
		],
	},
	{
		language: "swift",
		failures: [
			{
				heading: "Nested block comments",
				examples: [
					`/* Nested block
	/* comments
	are */
not supported */`,
				],
			},
		],
	},
	{
		language: "textile",
		failures: [
			{
				heading: "HTML inside Textile is not supported",
				description: "But Textile inside HTML should be just fine.",
				examples: [
					`&lt;strong>This _should_ work properly.&lt;/strong>
*But this is &lt;em>definitely&lt;/em> broken.*`,
				],
			},
		],
	},
	{
		language: "twig",
		failures: [
			{
				heading: "Tag containing Twig is not highlighted",
				examples: [`&lt;div{% if foo %} class="bar"{% endif %}>&lt;/div>`],
			},
		],
	},
	{
		language: "wiki",
		failures: [
			{
				heading: "Nested magic words are not supported",
				examples: [
					`{{#switch:{{PAGENAME}}
| L'Aquila = No translation
| L = Not OK
| L&apos;Aquila = Entity escaping
| L&#39;Aquila = Numeric char encoding
}}`,
				],
			},
			{
				heading: "Nesting of bold and italic is not supported",
				examples: [`''Italic with '''bold''' inside''`],
			},
		],
	},
];
