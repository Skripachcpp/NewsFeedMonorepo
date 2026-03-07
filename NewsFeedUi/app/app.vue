<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
/* CSS Reset - Modern Reset */
*,
*::before,
*::after {
  box-sizing: border-box;
}

* {
  margin: 0;
  padding: 0;
}

html,
body {
  height: 100%;
}

body {
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

img,
picture,
video,
canvas,
svg {
  display: block;
  max-width: 100%;
}

input,
button,
textarea,
select {
  font: inherit;
}

p,
h1,
h2,
h3,
h4,
h5,
h6 {
  overflow-wrap: break-word;
}

#__nuxt {
  isolation: isolate;
}

/* Remove default list styles */
ul,
ol {
  list-style: none;
}

/* Remove default link styles */
a {
  text-decoration: none;
  color: inherit;
}

/* Remove default button styles */
button {
  background: none;
  border: none;
  cursor: pointer;
}

/* Remove default table styles */
table {
  border-collapse: collapse;
  border-spacing: 0;
}

/* Remove default form styles */
fieldset {
  border: none;
  padding: 0;
  margin: 0;
}

/* Remove default quote styles */
blockquote,
q {
  quotes: none;
}

blockquote::before,
blockquote::after,
q::before,
q::after {
  content: "";
  content: none;
}
</style>
