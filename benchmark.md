---
tagline: Prism has a benchmark suite which can be run and extended similar to the test suite.
body_classes: language-javascript
scripts: <script src="https://dev.prismjs.com/components/prism-bash.js"></script>
---

<section>

# Running a benchmark

```bash
npm run benchmark
```

By default, the benchmark will be run for the current local version of your repository (the one which is currently checkout) and the [PrismJS master branch](https://github.com/PrismJS/prism/tree/master).

All `options` in `benchmark/config.json` can be changed by either directly editing the file or by passing arguments to the run command. I.e. you can overwrite the default `maxTime` value with 10s by running the following command:

```bash
npm run benchmark -- --maxTime=10
```

## Running a benchmark for specific languages

To run the tests only for a certain set of languages, you can use the `language` option:

```bash
npm run benchmark -- --language=javascript,markup
```
</section>

<section>

# Remotes

Remotes all you to compare different branches from different repos or the same repo. Repos can be the PrismJS repo or any your fork.

All remotes are specified under the `remotes` section in `benchmark/config.json`. To add a new remote, add an object with the `repo` and `branch` properties to the array. Note: if the branch property is not specified, the `master` branch will be used.  
Example:

```javascript
{
	repo: 'https://github.com/MyUserName/prism.git',
	branch: 'feature-1'
}
```

To remove a remote, simply remove (delete or comment out) its entry in the `remotes` array.
</section>

<section>

# Cases

A case is a collection of files where each file will be benchmarked with all candidates (local + remotes) and a specific language.

The language of a case is determined by its key in the `cases` object in `benchmark/config.json` where the key has to have the same format as the directory names in `tests/languages/`. Example:

```javascript
cases: {
	'css!+css-extras': ...
}
```

The files of a case can be specified by:

- Specifying the URI of files. A URI is either an HTTPS URL or a file path relative to `./benchmark/`.
    
    ```javascript
    cases: {
    	'css': {
    		files: [
    			'style.css',
    			'https://foo.com/main.css'
    		]
    	}
    }
    ```
    
- Using `extends` to copy all files from another case.
    
    ```javascript
    cases: {
    	'css': { files: [ 'style.css' ] },
    	'css!+css-extras': {
    		extends: 'css'
    	}
    }
    ```
</section>

<section>

# Output explained

The output of a benchmark might look like this:

```none
Found 1 cases with 2 files in total.
Test 3 candidates on tokenize
Estimated duration: 1m 0s
```

The first few lines give some information on the benchmark which is about to be run. This includes the number of cases (here 1), the total number of files in all cases (here 2), the number of candidates (here 3), the test function (here `tokenize`), and a time estimate for how long the benchmark will take (here 1 minute).

What follows are the results for all cases and their files:

```none
json

  components.json (25 kB)
  | local                         5.45ms ± 13% 138smp
  | PrismJS@master                4.92ms ±  2% 145smp
  | RunDevelopment@greedy-fix     5.62ms ±  4% 128smp
  package-lock.json (189 kB)
  | local                       117.75ms ± 27% 27smp
  | PrismJS@master              121.40ms ± 32% 29smp
  | RunDevelopment@greedy-fix   190.79ms ± 41% 20smp
```

A case starts with its key (here `json`) and is followed by all of its files (here `components.json` and `package-lock.json`). Under each file, the results for local and all remotes are shown. To explain the meaning of the values, let's pick a single line:

`PrismJS@master 121.40ms ± 32% 29smp`{ .language-none }

First comes the name of the remote (here PrismJS@master) followed by the mean of all samples, the relative margin of error, and the number of samples.

The last part of the output is a small summary of all cases which simply counts how many times a candidate has been the best or worst for a file.

```none
summary
                             best  worst
  local                         1      1
  PrismJS@master                0      1
  RunDevelopment@greedy-fix     1      0
```
</section>
