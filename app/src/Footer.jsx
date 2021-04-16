import React from 'react';

export default function Footer(props) {
  const index = props.index;
  const meta = index && index.meta;
  const version = meta && meta.version;
  const generated = meta && meta.generated;
  const released = generated && new Date(Date.parse(generated));

  let options = { month: 'long'};
//  const trimmed = generated && released.getFullYear() + " " + released.getMonth();
  const trimmed = released && released.split(' ');
  const display = released && version && `NSI v${version} (Generated: ${released} [${trimmed[0]} ${trimmed[1]} ${trimmed[2]}])`;
  return (
    <div id='footer'>{display}</div>
  );
};
