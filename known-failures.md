---
tagline: A list of rare edge cases where Prism highlights code incorrectly.
back_to_top: true
body_classes: language-none
resources: https://plugins.prismjs.com/autoloader/prism-autoloader.js
---

There are certain edge cases where Prism will fail. There are always such cases in every regex-based syntax highlighter.  
However, Prism dares to be open and honest about them. If a failure is listed here, it doesn’t mean it will never be fixed. This is more of a “known bugs” list, just with a certain type of bug.

<section class="language-applescript">

# AppleScript

## Comments only support one level of nesting

```
(* Nested block
	(* comments
		(* on more than
		2 levels *)
	are *)
not supported *)
```

</section>

<section class="language-autoit">

# AutoIt

## Nested block comments

```
#cs
	#cs
		foo()
	#ce
#ce
```

</section>

<section class="language-bison">

# Bison

## Two levels of nesting inside C section

```
{
	if($1) {
		if($2) {

		}
	}
} // <- Broken
%%
%%
```

</section>

<section class="language-d">

# D

## Comments only support one level of nesting

```
/+ /+ /+ this does not work +/ +/ +/
```

## Token strings only support one level of nesting

```
q{ q{ q{ this does not work } } }
```

</section>

<section class="language-elixir">

# Elixir

## String interpolation in single-quoted strings

```
'#{:atom} <- this should not be highlighted'
```

</section>

<section class="language-groovy">

# Groovy

## Two divisions on the same line

```
2 / 3 / 4
```

</section>

<section class="language-inform7">

# Inform 7

## Names starting with a number

```
The box 1A is a container
```

</section>

<section class="language-javascript">

# JavaScript

## String interpolation containing a closing brace

```
`${ /* } */ a + b }`
`${ '}' }`
```

## String interpolation with deeply nested braces

```
`${foo({ a: { b: { c: true } } })}`
```

</section>

<section class="language-less">

# Less

## At-rules looking like variables

```
@import "some file.less";
```

## At-rules containing interpolation

```
@import "@{themes}/tidal-wave.less";
```

## `extend` is not highlighted consistently

```
nav ul {
  &:extend(.inline);
  background: blue;
}
.a:extend(.b) {}
```

</section>

<section class="language-lua">

# Lua

## Functions with a single string parameter not using parentheses are not highlighted

```
foobar"param";
```

</section>

<section class="language-nasm">

# NASM

## Numbers with underscores

```
mov     ax,1100_1000b
mov     ax,1100_1000y
mov     ax,0b1100_1000
mov     ax,0y1100_1000

dd    1.222_222_222
```

</section>

<section class="language-parser">

# Parser

## Code block starting with a comment

```
# Doesn't work
# Does work
```

<pre><code> # Does work when prefixed with a space</code></pre>

## Comments inside expressions break literals and operators

```
^if(
    $age>=4  # not too young
    && $age<=80  # and not too old
)
```

</section>

<section class="language-prolog">

# Prolog

## Null-ary predicates are not highlighted

```
halt.
trace.

:- if(test1).
section_1.
:- elif(test2).
section_2.
:- elif(test3).
section_3.
:- else.
section_else.
:- endif.
```

</section>

<section class="language-puppet">

# Puppet

## More than one level of nested braces inside interpolation

```
"Foobar ${foo({
    bar => {baz => 42}
    baz => 42
})} <- broken"
```

</section>

<section class="language-python">

# Python

## Interpolation expressions containing strings with `{` or `}`

```
f"{'}'}"
```

</section>

<section class="language-q">

# Q (kdb+ database)

## The global context is highlighted as a verb

```
\d .
```

</section>

<section class="language-rest">

# reST (reStructuredText)

## Nothing is highlighted inside table cells

```
+---------------+----------+
| column 1     | column 2  |
+--------------+-----------+
| **bold**?    | *italic*? |
+--------------+-----------+
```

## The inline markup recognition rules are not as strict as they are in the spec

No inline markup should be highlighted in the following code.

```
2 * x a ** b (* BOM32_* ` `` _ __ |
"*" '|' (*) [*] {*} <*> ‘*’ ‚*‘ ‘*‚ ’*’ ‚*’ “*” „*“ “*„ ”*” „*” »*« ›*‹ «*» »*» ›*›
```

</section>

<section class="language-rust">

# Rust

## Nested block comments

```
/* Nested block
	/* comments
	are */
not supported */
```

## Delimiters of parameters for closures that don't use braces

```
|x| x + 1i;
```

</section>

<section class="language-sass">

# Sass (Sass)

## Deprecated Sass syntax is not supported

```
.page
  color = 5px + 9px

!width = 13px
.icon
  width = !width
```

## Selectors with pseudo classes are highlighted as property/value pairs

```
a:hover
  text-decoration: underline
```

</section>

<section class="language-scala">

# Scala

## Nested block comments

```
/* Nested block
	/* comments
	are */
not supported */
```

</section>

<section class="language-scheme">

# Scheme

## The first argument of `case-lambda` argument lists are highlighted as functions

```
(define plus
	(case-lambda
		(() 0)
		((x) x)
		((x y) (+ x y))
		((x y z) (+ (+ x y) z))
		(args (apply + args))))
```

</section>

<section class="language-swift">

# Swift

## Nested block comments

```
/* Nested block
	/* comments
	are */
not supported */
```

</section>

<section class="language-textile">

# Textile

## HTML inside Textile is not supported

But Textile inside HTML should be just fine.

```
<strong>This _should_ work properly.</strong>
*But this is <em>definitely</em> broken.*
```

</section>

<section class="language-twig">

# Twig

## Tag containing Twig is not highlighted

{% raw %}
```
<div{% if foo %} class="bar"{% endif %}></div>
```
{% endraw %}

</section>

<section class="language-wiki">

# Wiki markup

## Nested magic words are not supported

{% raw %}
```
{{#switch:{{PAGENAME}}
| L'Aquila = No translation
| L = Not OK
| L'Aquila = Entity escaping
| L'Aquila = Numeric char encoding
}}
```
{% endraw %}

## Nesting of bold and italic is not supported

```
''Italic with '''bold''' inside''
```

</section>

<section>

# Themes

Some of our themes are not compatible with certain layouts.

## Coy

Coy's shadows and background might not wrap around the code correctly if combined with float of flexbox layouts.

![](assets/img/failures/coy-overlap.png)

## Workarounds

There are 2 possible workarounds:

The first workaround is setting `display: flex-root;` for the `pre` element. This will fix the issue but `flex-root` has [limited browser support](https://caniuse.com/#feat=flow-root).

The second is adding `clear: both;` to the style of the `pre` element. This will fix the issue but it will change the way code blocks behave when overlapping with other elements.

</section>
