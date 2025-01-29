# JS Framework Benchmarks – HTML Web Components

This repo contains a few experiments creating benchmarks that use HTML Web Components as the core technology. It contains the following implementations:

- Vanilla JS HTML Web Component
- Vanilla JS [Portable HTML Web Component](https://hawkticehurst.com/2023/12/portable-html-web-components/)
- [Progressive Element](https://github.com/ChrisShank/progressive-element) by Chris Shank
- HTML Web Component inside SolidJS

**Initial results**

These benchmarks were run locally on a 2021 M1 Macbook Pro with 16GB RAM. The tests were conducted in January 2025.

![Screenshot of local benchmark run with several major web frameworks. The portable HTML web component implementation is the fastest, the vanilla JS HTML web component implementation is the third fastest, the HTML web component inside SolidJS implementation is the fourth fastest, and the Progressive Element implementation is the eighth fastest.](./assets/benchmark-results-01-28-25.png)

_Note: While the performance of benchmark runs showed in this photo are fairly close to the [most recent official run](https://krausest.github.io/js-framework-benchmark/2025/table_chrome_132.0.6834.83.html) of the JS Framework Benchmark, the performance for Solid and Svelte is notably worse (despite multiple re-runs). Both frameworks should have a weighted geometric mean of about 1.07, so keep in mind they should be faster than the vanilla-wc implementation._

**Misc**

My plan is to open a PR with the Vanilla JS HTML Web Component implementation, so a more official comparison can be made about the performance of HTML Web Components.