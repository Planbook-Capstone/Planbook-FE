'use client';

import React from 'react';

const AsyncCss = () => {
  return (
    <>
      <link
        rel="preload"
        href="/styles/a4-preview.css"
        as="style"
        onLoad={(e) => {
          const target = e.target as HTMLLinkElement;
          target.onload = null;
          target.rel = 'stylesheet';
        }}
      />
      <noscript>
        <link rel="stylesheet" href="/styles/a4-preview.css" />
      </noscript>
    </>
  );
};

export default AsyncCss;

