import React from 'react';

export default function Footer(props) {
  const index = props.index;
  const meta = index && index.meta;
  const version = meta && meta.version;
  const generated = meta && meta.generated;
  const released = generated && new Date(Date.parse(generated));

  const trimmed = generated && released.getFullYear();
  const display = released && version && `NSI v${version} (Generated: ${released} [${trimmed}])`;
  return (
    <div id='footer'>{display}</div>
  );
};
